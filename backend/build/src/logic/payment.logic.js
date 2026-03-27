"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePaymentLogic = initiatePaymentLogic;
exports.queryPaymentStatusLogic = queryPaymentStatusLogic;
exports.refundPaymentLogic = refundPaymentLogic;
exports.releaseEscrowToTasker = releaseEscrowToTasker;
exports.handlePaymentWebhook = handlePaymentWebhook;
const data_source_1 = require("../connection/data-source");
const taskService_1 = require("../services/taskService");
const userService_1 = require("../services/userService");
const interswitch_client_1 = require("../services/interswitch.client");
const EscrowAccount_entity_1 = require("../entities/EscrowAccount.entity");
const Transaction_entity_1 = require("../entities/Transaction.entity");
const Payout_entity_1 = require("../entities/Payout.entity");
const enums_1 = require("../entities/enums");
const errors_1 = require("../errors/errors");
const taskService = new taskService_1.TaskService();
const userService = new userService_1.UserService();
// ─── Fee calculation ──────────────────────────────────────────────────────────
function calculateFees(grossKobo) {
    const platformFeeKobo = (grossKobo * 12n) / 100n; // 12% poster pays
    const netAfterPlatform = grossKobo - platformFeeKobo;
    const taskerCommissionKobo = (netAfterPlatform * 3n) / 100n; // 3% tasker commission
    const netPayoutKobo = netAfterPlatform - taskerCommissionKobo;
    return { platformFeeKobo, taskerCommissionKobo, netPayoutKobo };
}
// ─── Idempotency key helper ───────────────────────────────────────────────────
function makeIdempotencyKey(type, taskId) {
    return `${type}_${taskId}_${Date.now()}`;
}
// ─── INITIATE PAYMENT ─────────────────────────────────────────────────────────
async function initiatePaymentLogic(posterId, taskId) {
    const task = await taskService.getTaskById(taskId, true);
    if (task.posterId !== posterId) {
        throw new errors_1.ForbiddenException('Only the task poster can initiate payment');
    }
    if (!task.finalPriceKobo || !task.taskerId) {
        throw new errors_1.BadRequestException('A bid must be accepted before initiating payment');
    }
    if (task.status !== enums_1.TaskStatus.OPEN) {
        throw new errors_1.BadRequestException('Payment can only be initiated for tasks in OPEN status after a bid is accepted');
    }
    const escrowRepo = data_source_1.AppDataSource.getRepository(EscrowAccount_entity_1.EscrowAccount);
    const txnRepo = data_source_1.AppDataSource.getRepository(Transaction_entity_1.Transaction);
    // Idempotency: if a pending escrow already exists for this task, return the same ref
    const existingEscrow = await escrowRepo.findOne({ where: { taskId } });
    if (existingEscrow) {
        const existingTxn = await txnRepo.findOne({
            where: { taskId, type: enums_1.TransactionType.CHARGE, status: enums_1.TransactionStatus.PENDING },
        });
        if (existingTxn) {
            const result = await interswitch_client_1.iswClient.initiatePayment({
                amountKobo: Number(existingTxn.amountKobo),
                transactionRef: existingTxn.idempotencyKey,
                customerId: posterId,
                customerEmail: task.poster.email,
                customerName: task.poster.fullName,
                description: `Payment for task: ${task.title}`,
            });
            return { ...result, transactionRef: existingTxn.idempotencyKey };
        }
    }
    const grossKobo = BigInt(task.finalPriceKobo);
    const { platformFeeKobo, taskerCommissionKobo, netPayoutKobo } = calculateFees(grossKobo);
    const transactionRef = makeIdempotencyKey('CHARGE', taskId);
    // Create the escrow record (heldAt is null until webhook confirms payment)
    const escrow = escrowRepo.create({
        taskId,
        posterUserId: posterId,
        taskerUserId: task.taskerId,
        grossAmountKobo: String(grossKobo),
        platformFeeKobo: String(platformFeeKobo),
        taskerCommissionKobo: String(taskerCommissionKobo),
        netPayoutKobo: String(netPayoutKobo),
        status: enums_1.EscrowStatus.HOLDING, // Optimistic; only truly held after webhook
    });
    await escrowRepo.save(escrow);
    // Create a pending transaction for this charge
    const txn = txnRepo.create({
        taskId,
        escrowId: escrow.id,
        userId: posterId,
        type: enums_1.TransactionType.CHARGE,
        amountKobo: String(grossKobo),
        status: enums_1.TransactionStatus.PENDING,
        idempotencyKey: transactionRef,
        metadata: { description: task.title },
    });
    await txnRepo.save(txn);
    // Build the ISW payment URL
    const result = await interswitch_client_1.iswClient.initiatePayment({
        amountKobo: Number(grossKobo),
        transactionRef,
        customerId: posterId,
        customerEmail: task.poster.email,
        customerName: task.poster.fullName,
        description: `Payment for task: ${task.title}`,
    });
    return { ...result, amountKobo: Number(grossKobo) };
}
// ─── QUERY PAYMENT STATUS ─────────────────────────────────────────────────────
async function queryPaymentStatusLogic(userId, taskId) {
    const task = await taskService.getTaskById(taskId);
    if (task.posterId !== userId) {
        throw new errors_1.ForbiddenException('Only the task poster can query payment status');
    }
    const txnRepo = data_source_1.AppDataSource.getRepository(Transaction_entity_1.Transaction);
    const txn = await txnRepo.findOne({
        where: { taskId, type: enums_1.TransactionType.CHARGE },
        order: { createdAt: 'DESC' },
    });
    if (!txn)
        throw new errors_1.NotFoundException('No payment transaction found for this task');
    // If already succeeded, return cached status
    if (txn.status === enums_1.TransactionStatus.SUCCESS) {
        return { status: 'SUCCEEDED', transactionRef: txn.idempotencyKey, amountKobo: txn.amountKobo };
    }
    // Query live status from Interswitch
    const iswResult = await interswitch_client_1.iswClient.queryTransaction(txn.idempotencyKey, Number(txn.amountKobo));
    // Update transaction if payment succeeded on ISW side
    if (iswResult.responseCode === '00') {
        txn.status = enums_1.TransactionStatus.SUCCESS;
        txn.iswResponseCode = iswResult.responseCode;
        await txnRepo.save(txn);
    }
    return {
        status: iswResult.responseCode === '00' ? 'SUCCEEDED' : 'PENDING',
        responseCode: iswResult.responseCode,
        responseDescription: iswResult.responseDescription,
        transactionRef: txn.idempotencyKey,
        amountKobo: txn.amountKobo,
    };
}
// ─── REFUND (admin) ───────────────────────────────────────────────────────────
async function refundPaymentLogic(taskId, reason) {
    const escrowRepo = data_source_1.AppDataSource.getRepository(EscrowAccount_entity_1.EscrowAccount);
    const txnRepo = data_source_1.AppDataSource.getRepository(Transaction_entity_1.Transaction);
    const escrow = await escrowRepo.findOne({ where: { taskId } });
    if (!escrow)
        throw new errors_1.NotFoundException('No escrow found for this task');
    if (escrow.status === enums_1.EscrowStatus.REFUNDED) {
        throw new errors_1.BadRequestException('This escrow has already been refunded');
    }
    if (escrow.status === enums_1.EscrowStatus.RELEASED) {
        throw new errors_1.BadRequestException('Cannot refund — payout has already been released');
    }
    // Get the original charge transaction for the ISW ref
    const chargeTxn = await txnRepo.findOne({
        where: { taskId, type: enums_1.TransactionType.CHARGE, status: enums_1.TransactionStatus.SUCCESS },
    });
    if (!chargeTxn)
        throw new errors_1.BadRequestException('No confirmed payment found to refund');
    const result = await interswitch_client_1.iswClient.refundTransaction({
        transactionRef: chargeTxn.idempotencyKey,
        amountKobo: Number(escrow.grossAmountKobo),
        narration: reason,
    });
    if (result.responseCode !== '00') {
        throw new errors_1.BadRequestException(`Refund failed: ${result.responseDescription} (code: ${result.responseCode})`);
    }
    // Update escrow
    escrow.status = enums_1.EscrowStatus.REFUNDED;
    escrow.iswRefundRef = result.refundRef;
    await escrowRepo.save(escrow);
    // Create refund transaction record
    const refundTxn = txnRepo.create({
        taskId,
        escrowId: escrow.id,
        userId: escrow.posterUserId,
        type: enums_1.TransactionType.REFUND,
        amountKobo: escrow.grossAmountKobo,
        status: enums_1.TransactionStatus.SUCCESS,
        iswReference: result.refundRef,
        iswResponseCode: result.responseCode,
        idempotencyKey: makeIdempotencyKey('REFUND', taskId),
        metadata: { reason, originalRef: chargeTxn.idempotencyKey },
    });
    await txnRepo.save(refundTxn);
    // Update task status
    await taskService.updateTaskFields(taskId, { status: enums_1.TaskStatus.REFUNDED });
    return { message: 'Refund initiated successfully', refundRef: result.refundRef };
}
// ─── RELEASE TO TASKER (called by webhook + confirm endpoint) ─────────────────
async function releaseEscrowToTasker(taskId) {
    const escrowRepo = data_source_1.AppDataSource.getRepository(EscrowAccount_entity_1.EscrowAccount);
    const txnRepo = data_source_1.AppDataSource.getRepository(Transaction_entity_1.Transaction);
    const escrow = await escrowRepo.findOne({
        where: { taskId },
        relations: ['tasker'],
    });
    if (!escrow)
        throw new errors_1.NotFoundException('No escrow found for this task');
    if (escrow.status !== enums_1.EscrowStatus.HOLDING) {
        // Idempotent — already released/refunded/disputed, silently skip
        return;
    }
    // Load tasker bank details
    const tasker = await userService.getUser(escrow.taskerUserId);
    if (!tasker.accountNumber || !tasker.bankCode || !tasker.accountName) {
        throw new errors_1.BadRequestException('Tasker has not linked a bank account. Cannot release escrow.');
    }
    const uniqueRef = makeIdempotencyKey('PAYOUT', taskId);
    const transfer = await interswitch_client_1.iswClient.sendMoney({
        amountKobo: Number(escrow.netPayoutKobo),
        beneficiaryAccountName: tasker.accountName,
        beneficiaryAccountNumber: tasker.accountNumber,
        beneficiaryBankCode: tasker.bankCode,
        narration: `Taskly payout for task ${taskId}`,
        senderName: 'Taskly Platform',
        uniqueReference: uniqueRef,
    });
    if (transfer.responseCode !== '00') {
        throw new errors_1.BadRequestException(`Payout failed: ${transfer.responseDescription} (code: ${transfer.responseCode})`);
    }
    // Create payout record
    const payoutRepo = data_source_1.AppDataSource.getRepository(Payout_entity_1.Payout);
    const payout = payoutRepo.create({
        taskerId: escrow.taskerUserId,
        taskId,
        amountKobo: escrow.netPayoutKobo,
        bankCode: tasker.bankCode,
        accountNumber: tasker.accountNumber,
        accountName: tasker.accountName,
        status: enums_1.TransactionStatus.SUCCESS,
        iswTransferRef: transfer.transferCode,
        iswResponseCode: transfer.responseCode,
    });
    await payoutRepo.save(payout);
    // Create transaction record
    const txn = txnRepo.create({
        taskId,
        escrowId: escrow.id,
        userId: escrow.taskerUserId,
        type: enums_1.TransactionType.TASKER_PAYOUT,
        amountKobo: escrow.netPayoutKobo,
        status: enums_1.TransactionStatus.SUCCESS,
        iswReference: transfer.transferCode,
        iswResponseCode: transfer.responseCode,
        idempotencyKey: uniqueRef,
        metadata: { bankCode: tasker.bankCode, accountNumber: tasker.accountNumber },
    });
    await txnRepo.save(txn);
    // Mark escrow released
    escrow.status = enums_1.EscrowStatus.RELEASED;
    escrow.iswTransferRef = transfer.transferCode;
    escrow.releasedAt = new Date();
    await escrowRepo.save(escrow);
    // Mark task completed
    await taskService.updateTaskFields(taskId, { status: enums_1.TaskStatus.COMPLETED });
}
// ─── WEBHOOK: confirm payment from Interswitch ───────────────────────────────
async function handlePaymentWebhook(payload) {
    if (payload.responseCode !== '00') {
        // Non-success notification — update pending transaction to FAILED
        const txnRepo = data_source_1.AppDataSource.getRepository(Transaction_entity_1.Transaction);
        await txnRepo.update({ idempotencyKey: payload.txnRef, status: enums_1.TransactionStatus.PENDING }, { status: enums_1.TransactionStatus.FAILED, iswResponseCode: payload.responseCode });
        return { processed: false, reason: 'Non-success response code' };
    }
    const txnRepo = data_source_1.AppDataSource.getRepository(Transaction_entity_1.Transaction);
    const escrowRepo = data_source_1.AppDataSource.getRepository(EscrowAccount_entity_1.EscrowAccount);
    const txn = await txnRepo.findOne({ where: { idempotencyKey: payload.txnRef } });
    if (!txn)
        return { processed: false, reason: 'Transaction ref not found' };
    // Idempotency: already processed
    if (txn.status === enums_1.TransactionStatus.SUCCESS) {
        return { processed: true, reason: 'Already processed' };
    }
    // Update transaction
    txn.status = enums_1.TransactionStatus.SUCCESS;
    txn.iswResponseCode = payload.responseCode;
    await txnRepo.save(txn);
    // Confirm escrow hold
    if (txn.escrowId) {
        const escrow = await escrowRepo.findOne({ where: { id: txn.escrowId } });
        if (escrow) {
            escrow.heldAt = new Date();
            await escrowRepo.save(escrow);
        }
    }
    // Move task from OPEN → ASSIGNED
    const task = await taskService.getTaskById(txn.taskId);
    if (task.status === enums_1.TaskStatus.OPEN) {
        await taskService.updateTaskFields(txn.taskId, { status: enums_1.TaskStatus.ASSIGNED });
    }
    // TODO: Emit Socket.IO event "payment:confirmed" to poster + tasker
    // TODO: Send push notifications via NotificationsService
    return { processed: true, taskId: txn.taskId };
}
//# sourceMappingURL=payment.logic.js.map