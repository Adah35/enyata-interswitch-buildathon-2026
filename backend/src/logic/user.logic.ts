import { AppDataSource, getRepository } from '../connection/data-source';
import { UserService } from '../services/userService';
import { iswClient } from '../services/interswitch.client';
import { Notification } from '../entities/Notification.entity';
import { User } from '../entities/User.entity';
import { KycLevel } from '../entities/enums';
import {
  BadRequestException,
  NotFoundException,
} from '../errors/errors';

const userService = new UserService();

export interface UpdateProfileInput {
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface SaveBankAccountInput {
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

// ─── GET /me ─────────────────────────────────────────────────────────────────

export async function getMyProfileLogic(userId: string) {
  const user = await userService.getUser(userId);
  return userService.toDTO(user);
}

// ─── PATCH /me ────────────────────────────────────────────────────────────────

export async function updateMyProfileLogic(userId: string, data: UpdateProfileInput) {
  return userService.updateUser(userId, data);
}

export const completeKyc = async (
  userId: string,
  data: { nin: string; passportUrl: string; bvn: string }
) => {
  const { nin, bvn, passportUrl } = data;
  if (!nin || !bvn) throw new BadRequestException('NIN and BVN are required');
  if (!passportUrl) throw new BadRequestException('Passport URL is required');

  // Check uniqueness of NIN and BVN
  const repo = getRepository(User);
  const ninExists = await repo.findOne({ where: { nin } });
  if (ninExists && ninExists.id !== userId) {
    throw new BadRequestException('NIN already in use by another user');
  }
  const bvnExists = await repo.findOne({ where: { bvn } });
  if (bvnExists && bvnExists.id !== userId) {
    throw new BadRequestException('BVN already in use by another user');
  }

  // Optionally: Call external APIs to verify NIN/BVN here
  // Example: await verifyNinApi(nin); await verifyBvnApi(bvn);

  // Update user with KYC info
  await repo.update(userId, {
    nin,
    bvn,
    passportUrl,
    kycLevel: KycLevel.ID_VERIFIED,
  });

  // Optionally: Notify user
  // await NotificationService.sendKycCompleted(userId);

  const updated = await userService.getUser(userId);
  return userService.toDTO(updated);
};

// ─── POST /me/bank-account ────────────────────────────────────────────────────

export async function saveBankAccountLogic(userId: string, data: SaveBankAccountInput) {
  const user = await userService.getUser(userId);

  // Write-once: protect against silent overwrites
  if (user.accountNumber) {
    throw new BadRequestException(
      'Bank account already linked. Contact support to update bank details.',
    );
  }

  const repo = getRepository(User);
  await repo.update(userId, {
    bankCode: data.bankCode,
    accountNumber: data.accountNumber,
    accountName: data.accountName,
    // Upgrade KYC to PAYOUT once bank is linked (phone already verified at this point)
    kycLevel: user.isPhoneVerified ? KycLevel.PAYOUT : user.kycLevel,
  });

  const updated = await userService.getUser(userId);
  return userService.toDTO(updated);
}

// ─── GET /me/bank-account/verify ──────────────────────────────────────────────

export async function verifyBankAccountLogic(accountNumber: string, bankCode: string) {
  return iswClient.resolveBankAccount(accountNumber, bankCode);
}


export async function getPublicProfileLogic(targetId: string) {
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


export async function getNotificationsLogic(
  userId: string,
  page: number,
  limit: number,
  unreadOnly: boolean,
) {
  const notifRepo = AppDataSource.getRepository(Notification);

  const where: Partial<Notification> = { userId };
  if (unreadOnly) (where as any).isRead = false;

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


export async function markNotificationReadLogic(userId: string, notifId: string) {
  const notifRepo = AppDataSource.getRepository(Notification);
  const notif = await notifRepo.findOne({ where: { id: notifId, userId } });
  if (!notif) throw new NotFoundException('Notification not found');

  notif.isRead = true;
  await notifRepo.save(notif);
  return notif;
}
