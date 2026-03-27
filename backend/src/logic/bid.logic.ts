import { AppDataSource } from '../connection/data-source';
import { BidService } from '../services/bidService';
import { TaskService } from '../services/taskService';
import { Bid } from '../entities/Bid.entity';
import { BidStatus, TaskStatus } from '../entities/enums';
import {
  BadRequestException,
  ForbiddenException,
} from '../errors/errors';

const bidService = new BidService();
const taskService = new TaskService();

// ─── DTO ──────────────────────────────────────────────────────────────────────

function toBidDTO(bid: Bid) {
  return {
    id: bid.id,
    taskId: bid.taskId,
    amountKobo: bid.amountKobo,
    message: bid.message,
    status: bid.status,
    acceptedAt: bid.acceptedAt,
    createdAt: bid.createdAt,
    updatedAt: bid.updatedAt,
    tasker: bid.tasker
      ? {
          id: bid.tasker.id,
          fullName: bid.tasker.fullName,
          avatarUrl: bid.tasker.avatarUrl,
          avgRatingAsTasker: bid.tasker.avgRatingAsTasker,
          totalTasksDone: bid.tasker.totalTasksDone,
        }
      : { id: bid.taskerId },
  };
}

// ─── SUBMIT BID ───────────────────────────────────────────────────────────────

export async function submitBidLogic(
  taskerId: string,
  taskId: string,
  body: { amountKobo: number; message?: string },
) {
  const task = await taskService.getTaskById(taskId);

  if (task.status !== TaskStatus.OPEN) {
    throw new BadRequestException('Task is not open for bidding');
  }
  if (task.posterId === taskerId) {
    throw new BadRequestException('You cannot bid on your own task');
  }

  // Check duplicate (unique constraint will also catch this, but give friendly error)
  const existing = await bidService.getTaskerBid(taskId, taskerId);
  if (existing) {
    if (existing.status === BidStatus.WITHDRAWN) {
      throw new BadRequestException('You have already withdrawn your bid on this task');
    }
    throw new BadRequestException('You have already placed a bid on this task');
  }

  const bidRepo = AppDataSource.getRepository(Bid);
  const bid = bidRepo.create({
    taskId,
    taskerId,
    amountKobo: String(body.amountKobo),
    message: body.message ?? null,
    status: BidStatus.PENDING,
  });
  await bidRepo.save(bid);

  // Reload with tasker relation for DTO
  const saved = await bidService.getBidForTask(taskId, bid.id);
  return toBidDTO(saved);
}

// ─── LIST BIDS ────────────────────────────────────────────────────────────────

export async function listBidsLogic(posterId: string, taskId: string) {
  const task = await taskService.getTaskById(taskId);

  if (task.posterId !== posterId) {
    throw new ForbiddenException('Only the task poster can view all bids');
  }

  const bids = await bidService.listBidsForTask(taskId);
  return bids.map(toBidDTO);
}

// ─── ACCEPT BID ───────────────────────────────────────────────────────────────

export async function acceptBidLogic(posterId: string, taskId: string, bidId: string) {
  const task = await taskService.getTaskById(taskId);

  if (task.posterId !== posterId) {
    throw new ForbiddenException('Only the task poster can accept a bid');
  }
  if (task.status !== TaskStatus.OPEN) {
    throw new BadRequestException('Task is not in a state where bids can be accepted');
  }

  const bid = await bidService.getBidForTask(taskId, bidId);

  if (bid.status !== BidStatus.PENDING) {
    throw new BadRequestException('Only pending bids can be accepted');
  }

  // Accept this bid
  const bidRepo = AppDataSource.getRepository(Bid);
  bid.status = BidStatus.ACCEPTED;
  bid.acceptedAt = new Date();
  await bidRepo.save(bid);

  // Reject all other bids on this task
  await bidService.rejectAllOtherBids(taskId, bidId);

  // Set task's tasker + finalPrice (task stays OPEN until payment confirmed via webhook)
  await taskService.updateTaskFields(taskId, {
    taskerId: bid.taskerId,
    finalPriceKobo: bid.amountKobo,
  });

  return toBidDTO(bid);
}

// ─── REJECT BID ───────────────────────────────────────────────────────────────

export async function rejectBidLogic(posterId: string, taskId: string, bidId: string) {
  const task = await taskService.getTaskById(taskId);

  if (task.posterId !== posterId) {
    throw new ForbiddenException('Only the task poster can reject bids');
  }

  const bid = await bidService.getBidForTask(taskId, bidId);

  if (bid.status !== BidStatus.PENDING) {
    throw new BadRequestException('Only pending bids can be rejected');
  }

  const bidRepo = AppDataSource.getRepository(Bid);
  bid.status = BidStatus.REJECTED;
  await bidRepo.save(bid);

  return toBidDTO(bid);
}

// ─── WITHDRAW BID ─────────────────────────────────────────────────────────────

export async function withdrawBidLogic(taskerId: string, taskId: string, bidId: string) {
  const bid = await bidService.getBidForTask(taskId, bidId);

  if (bid.taskerId !== taskerId) {
    throw new ForbiddenException('You can only withdraw your own bids');
  }
  if (bid.status !== BidStatus.PENDING) {
    throw new BadRequestException('Only pending bids can be withdrawn');
  }

  const bidRepo = AppDataSource.getRepository(Bid);
  bid.status = BidStatus.WITHDRAWN;
  await bidRepo.save(bid);

  return toBidDTO(bid);
}
