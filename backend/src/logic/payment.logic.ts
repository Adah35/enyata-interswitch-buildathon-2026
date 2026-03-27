import { AppDataSource } from '../connection/data-source';
import { TaskService } from '../services/taskService';
import { UserService } from '../services/userService';
import { iswClient } from '../services/interswitch.client';
import { EscrowAccount } from '../entities/EscrowAccount.entity';
import { Transaction } from '../entities/Transaction.entity';
import { Payout } from '../entities/Payout.entity';
import { EscrowStatus, TaskStatus, TransactionStatus, TransactionType } from '../entities/enums';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '../errors/errors';

const taskService = new TaskService();
const userService = new UserService();

// ─── Fee calculation ──────────────────────────────────────────────────────────

function calculateFees(grossKobo: bigint): {
  platformFeeKobo: bigint;
  taskerCommissionKobo: bigint;
  netPayoutKobo: bigint;
} {
  const platformFeeKobo = (grossKobo * 12n) / 100n;          // 12% poster pays
  const netAfterPlatform = grossKobo - platformFeeKobo;
  const taskerCommissionKobo = (netAfterPlatform * 3n) / 100n; // 3% tasker commission
  const netPayoutKobo = netAfterPlatform - taskerCommissionKobo;
  return { platformFeeKobo, taskerCommissionKobo, netPayoutKobo };
}

// ─── Idempotency key helper ───────────────────────────────────────────────────

function makeIdempotencyKey(type: string, taskId: string): string {
  return `${type}_${taskId}_${Date.now()}`;
}

// ─── INITIATE PAYMENT ─────────────────────────────────────────────────────────

export async function initiatePaymentLogic(posterId: string, taskId: string) {
  const task = await taskService.getTaskById(taskId, true);

  if (task.posterId !== posterId) {
    throw new ForbiddenException('Only the task poster can initiate payment');
  }
  if (!task.finalPriceKobo || !task.taskerId) {
    throw new BadRequestException(
      'A bid must be accepted before initiating payment',
    );
  }
  if (task.status !== TaskStatus.OPEN) {
    throw new BadRequestException(
      'Payment can only be initiated for tasks in OPEN status after a bid is accepted',
    );
  }

  const escrowRepo = AppDataSource.getRepository(EscrowAccount);
  const txnRepo = AppDataSource.getRepository(Transaction);

  // Idempotency: if a pending escrow already exists for this task, return the same ref
  const existingEscrow = await escrowRepo.findOne({ where: { taskId } });
  if (existingEscrow) {
    const existingTxn = await txnRepo.findOne({
      where: { taskId, type: TransactionType.CHARGE, status: TransactionStatus.PENDING },
    });
    if (existingTxn) {
      const result = await iswClient.initiatePayment({
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
    status: EscrowStatus.HOLDING, // Optimistic; only truly held after webhook
  });
  await escrowRepo.save(escrow);

  // Create a pending transaction for this charge
  const txn = txnRepo.create({
    taskId,
    escrowId: escrow.id,
    userId: posterId,
    type: TransactionType.CHARGE,
    amountKobo: String(grossKobo),
    status: TransactionStatus.PENDING,
    idempotencyKey: transactionRef,
    metadata: { description: task.title },
  });
  await txnRepo.save(txn);

  // Build the ISW payment URL
  const result = await iswClient.initiatePayment({
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

export async function queryPaymentStatusLogic(userId: string, taskId: string) {
  const task = await taskService.getTaskById(taskId);
  if (task.posterId !== userId) {
    throw new ForbiddenException('Only the task poster can query payment status');
  }

  const txnRepo = AppDataSource.getRepository(Transaction);
  const txn = await txnRepo.findOne({
    where: { taskId, type: TransactionType.CHARGE },
    order: { createdAt: 'DESC' },
  });

  if (!txn) throw new NotFoundException('No payment transaction found for this task');

  // If already succeeded, return cached status
  if (txn.status === TransactionStatus.SUCCESS) {
    return { status: 'SUCCEEDED', transactionRef: txn.idempotencyKey, amountKobo: txn.amountKobo };
  }

  // Query live status from Interswitch
  const iswResult = await iswClient.queryTransaction(txn.idempotencyKey, Number(txn.amountKobo));

  // Update transaction if payment succeeded on ISW side
  if (iswResult.responseCode === '00') {
    txn.status = TransactionStatus.SUCCESS;
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

export async function refundPaymentLogic(taskId: string, reason: string) {
  const escrowRepo = AppDataSource.getRepository(EscrowAccount);
  const txnRepo = AppDataSource.getRepository(Transaction);

  const escrow = await escrowRepo.findOne({ where: { taskId } });
  if (!escrow) throw new NotFoundException('No escrow found for this task');

  if (escrow.status === EscrowStatus.REFUNDED) {
    throw new BadRequestException('This escrow has already been refunded');
  }
  if (escrow.status === EscrowStatus.RELEASED) {
    throw new BadRequestException('Cannot refund — payout has already been released');
  }

  // Get the original charge transaction for the ISW ref
  const chargeTxn = await txnRepo.findOne({
    where: { taskId, type: TransactionType.CHARGE, status: TransactionStatus.SUCCESS },
  });
  if (!chargeTxn) throw new BadRequestException('No confirmed payment found to refund');

  const result = await iswClient.refundTransaction({
    transactionRef: chargeTxn.idempotencyKey,
    amountKobo: Number(escrow.grossAmountKobo),
    narration: reason,
  });

  if (result.responseCode !== '00') {
    throw new BadRequestException(
      `Refund failed: ${result.responseDescription} (code: ${result.responseCode})`,
    );
  }

  // Update escrow
  escrow.status = EscrowStatus.REFUNDED;
  escrow.iswRefundRef = result.refundRef;
  await escrowRepo.save(escrow);

  // Create refund transaction record
  const refundTxn = txnRepo.create({
    taskId,
    escrowId: escrow.id,
    userId: escrow.posterUserId,
    type: TransactionType.REFUND,
    amountKobo: escrow.grossAmountKobo,
    status: TransactionStatus.SUCCESS,
    iswReference: result.refundRef,
    iswResponseCode: result.responseCode,
    idempotencyKey: makeIdempotencyKey('REFUND', taskId),
    metadata: { reason, originalRef: chargeTxn.idempotencyKey },
  });
  await txnRepo.save(refundTxn);

  // Update task status
  await taskService.updateTaskFields(taskId, { status: TaskStatus.REFUNDED });

  return { message: 'Refund initiated successfully', refundRef: result.refundRef };
}

// ─── RELEASE TO TASKER (called by webhook + confirm endpoint) ─────────────────

export async function releaseEscrowToTasker(taskId: string): Promise<void> {
  const escrowRepo = AppDataSource.getRepository(EscrowAccount);
  const txnRepo = AppDataSource.getRepository(Transaction);

  const escrow = await escrowRepo.findOne({
    where: { taskId },
    relations: ['tasker'],
  });
  if (!escrow) throw new NotFoundException('No escrow found for this task');

  if (escrow.status !== EscrowStatus.HOLDING) {
    // Idempotent — already released/refunded/disputed, silently skip
    return;
  }

  // Load tasker bank details
  const tasker = await userService.getUser(escrow.taskerUserId!);
  if (!tasker.accountNumber || !tasker.bankCode || !tasker.accountName) {
    throw new BadRequestException(
      'Tasker has not linked a bank account. Cannot release escrow.',
    );
  }

  const uniqueRef = makeIdempotencyKey('PAYOUT', taskId);

  const transfer = await iswClient.sendMoney({
    amountKobo: Number(escrow.netPayoutKobo),
    beneficiaryAccountName: tasker.accountName,
    beneficiaryAccountNumber: tasker.accountNumber,
    beneficiaryBankCode: tasker.bankCode,
    narration: `Taskly payout for task ${taskId}`,
    senderName: 'Taskly Platform',
    uniqueReference: uniqueRef,
  });

  if (transfer.responseCode !== '00') {
    throw new BadRequestException(
      `Payout failed: ${transfer.responseDescription} (code: ${transfer.responseCode})`,
    );
  }

  // Create payout record
  const payoutRepo = AppDataSource.getRepository(Payout);
  const payout = payoutRepo.create({
    taskerId: escrow.taskerUserId!,
    taskId,
    amountKobo: escrow.netPayoutKobo,
    bankCode: tasker.bankCode!,
    accountNumber: tasker.accountNumber!,
    accountName: tasker.accountName!,
    status: TransactionStatus.SUCCESS,
    iswTransferRef: transfer.transferCode,
    iswResponseCode: transfer.responseCode,
  });
  await payoutRepo.save(payout);

  // Create transaction record
  const txn = txnRepo.create({
    taskId,
    escrowId: escrow.id,
    userId: escrow.taskerUserId!,
    type: TransactionType.TASKER_PAYOUT,
    amountKobo: escrow.netPayoutKobo,
    status: TransactionStatus.SUCCESS,
    iswReference: transfer.transferCode,
    iswResponseCode: transfer.responseCode,
    idempotencyKey: uniqueRef,
    metadata: { bankCode: tasker.bankCode, accountNumber: tasker.accountNumber },
  });
  await txnRepo.save(txn);

  // Mark escrow released
  escrow.status = EscrowStatus.RELEASED;
  escrow.iswTransferRef = transfer.transferCode;
  escrow.releasedAt = new Date();
  await escrowRepo.save(escrow);

  // Mark task completed
  await taskService.updateTaskFields(taskId, { status: TaskStatus.COMPLETED });
}

// ─── WEBHOOK: confirm payment from Interswitch ───────────────────────────────

export async function handlePaymentWebhook(payload: {
  txnRef: string;
  responseCode: string;
  amount: number;
  merchantReference?: string;
}) {
  if (payload.responseCode !== '00') {
    // Non-success notification — update pending transaction to FAILED
    const txnRepo = AppDataSource.getRepository(Transaction);
    await txnRepo.update(
      { idempotencyKey: payload.txnRef, status: TransactionStatus.PENDING },
      { status: TransactionStatus.FAILED, iswResponseCode: payload.responseCode },
    );
    return { processed: false, reason: 'Non-success response code' };
  }

  const txnRepo = AppDataSource.getRepository(Transaction);
  const escrowRepo = AppDataSource.getRepository(EscrowAccount);

  const txn = await txnRepo.findOne({ where: { idempotencyKey: payload.txnRef } });
  if (!txn) return { processed: false, reason: 'Transaction ref not found' };

  // Idempotency: already processed
  if (txn.status === TransactionStatus.SUCCESS) {
    return { processed: true, reason: 'Already processed' };
  }

  // Update transaction
  txn.status = TransactionStatus.SUCCESS;
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
  if (task.status === TaskStatus.OPEN) {
    await taskService.updateTaskFields(txn.taskId, { status: TaskStatus.ASSIGNED });
  }

  // TODO: Emit Socket.IO event "payment:confirmed" to poster + tasker
  // TODO: Send push notifications via NotificationsService

  return { processed: true, taskId: txn.taskId };
}
