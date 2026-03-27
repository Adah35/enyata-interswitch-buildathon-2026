"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeKyc = void 0;
exports.getMyProfileLogic = getMyProfileLogic;
exports.updateMyProfileLogic = updateMyProfileLogic;
exports.saveBankAccountLogic = saveBankAccountLogic;
exports.verifyBankAccountLogic = verifyBankAccountLogic;
exports.getPublicProfileLogic = getPublicProfileLogic;
exports.getNotificationsLogic = getNotificationsLogic;
exports.markNotificationReadLogic = markNotificationReadLogic;
const data_source_1 = require("../connection/data-source");
const userService_1 = require("../services/userService");
const interswitch_client_1 = require("../services/interswitch.client");
const Notification_entity_1 = require("../entities/Notification.entity");
const User_entity_1 = require("../entities/User.entity");
const enums_1 = require("../entities/enums");
const errors_1 = require("../errors/errors");
const userService = new userService_1.UserService();
// ─── GET /me ─────────────────────────────────────────────────────────────────
async function getMyProfileLogic(userId) {
    const user = await userService.getUser(userId);
    return userService.toDTO(user);
}
// ─── PATCH /me ────────────────────────────────────────────────────────────────
async function updateMyProfileLogic(userId, data) {
    return userService.updateUser(userId, data);
}
const completeKyc = async (userId, data) => {
    const { nin, bvn, passportUrl } = data;
    if (!nin || !bvn)
        throw new errors_1.BadRequestException('NIN and BVN are required');
    if (!passportUrl)
        throw new errors_1.BadRequestException('Passport URL is required');
    // Check uniqueness of NIN and BVN
    const repo = (0, data_source_1.getRepository)(User_entity_1.User);
    const ninExists = await repo.findOne({ where: { nin } });
    if (ninExists && ninExists.id !== userId) {
        throw new errors_1.BadRequestException('NIN already in use by another user');
    }
    const bvnExists = await repo.findOne({ where: { bvn } });
    if (bvnExists && bvnExists.id !== userId) {
        throw new errors_1.BadRequestException('BVN already in use by another user');
    }
    // Optionally: Call external APIs to verify NIN/BVN here
    // Example: await verifyNinApi(nin); await verifyBvnApi(bvn);
    // Update user with KYC info
    await repo.update(userId, {
        nin,
        bvn,
        passportUrl,
        kycLevel: enums_1.KycLevel.ID_VERIFIED,
    });
    // Optionally: Notify user
    // await NotificationService.sendKycCompleted(userId);
    const updated = await userService.getUser(userId);
    return userService.toDTO(updated);
};
exports.completeKyc = completeKyc;
// ─── POST /me/bank-account ────────────────────────────────────────────────────
async function saveBankAccountLogic(userId, data) {
    const user = await userService.getUser(userId);
    // Write-once: protect against silent overwrites
    if (user.accountNumber) {
        throw new errors_1.BadRequestException('Bank account already linked. Contact support to update bank details.');
    }
    const repo = (0, data_source_1.getRepository)(User_entity_1.User);
    await repo.update(userId, {
        bankCode: data.bankCode,
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        // Upgrade KYC to PAYOUT once bank is linked (phone already verified at this point)
        kycLevel: user.isPhoneVerified ? enums_1.KycLevel.PAYOUT : user.kycLevel,
    });
    const updated = await userService.getUser(userId);
    return userService.toDTO(updated);
}
// ─── GET /me/bank-account/verify ──────────────────────────────────────────────
async function verifyBankAccountLogic(accountNumber, bankCode) {
    return interswitch_client_1.iswClient.resolveBankAccount(accountNumber, bankCode);
}
async function getPublicProfileLogic(targetId) {
    const user = await userService.getUser(targetId);
    return {
        id: user.id,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        role: user.role,
        avgRatingAsTasker: user.avgRatingAsTasker,
        avgRatingAsPoster: user.avgRatingAsPoster,
        totalTasksDone: user.totalTasksDone,
        totalTasksPosted: user.totalTasksPosted,
        createdAt: user.createdAt,
    };
}
async function getNotificationsLogic(userId, page, limit, unreadOnly) {
    const notifRepo = data_source_1.AppDataSource.getRepository(Notification_entity_1.Notification);
    const where = { userId };
    if (unreadOnly)
        where.isRead = false;
    const [notifications, total] = await notifRepo.findAndCount({
        where,
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
    });
    return {
        data: notifications,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}
async function markNotificationReadLogic(userId, notifId) {
    const notifRepo = data_source_1.AppDataSource.getRepository(Notification_entity_1.Notification);
    const notif = await notifRepo.findOne({ where: { id: notifId, userId } });
    if (!notif)
        throw new errors_1.NotFoundException('Notification not found');
    notif.isRead = true;
    await notifRepo.save(notif);
    return notif;
}
//# sourceMappingURL=user.logic.js.map