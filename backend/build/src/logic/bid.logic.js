"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitBidLogic = submitBidLogic;
exports.listBidsLogic = listBidsLogic;
exports.acceptBidLogic = acceptBidLogic;
exports.rejectBidLogic = rejectBidLogic;
exports.withdrawBidLogic = withdrawBidLogic;
const data_source_1 = require("../connection/data-source");
const bidService_1 = require("../services/bidService");
const taskService_1 = require("../services/taskService");
const Bid_entity_1 = require("../entities/Bid.entity");
const enums_1 = require("../entities/enums");
const errors_1 = require("../errors/errors");
const bidService = new bidService_1.BidService();
const taskService = new taskService_1.TaskService();
// ─── DTO ──────────────────────────────────────────────────────────────────────
function toBidDTO(bid) {
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
async function submitBidLogic(taskerId, taskId, body) {
    const task = await taskService.getTaskById(taskId);
    if (task.status !== enums_1.TaskStatus.OPEN) {
        throw new errors_1.BadRequestException('Task is not open for bidding');
    }
    if (task.posterId === taskerId) {
        throw new errors_1.BadRequestException('You cannot bid on your own task');
    }
    // Check duplicate (unique constraint will also catch this, but give friendly error)
    const existing = await bidService.getTaskerBid(taskId, taskerId);
    if (existing) {
        if (existing.status === enums_1.BidStatus.WITHDRAWN) {
            throw new errors_1.BadRequestException('You have already withdrawn your bid on this task');
        }
        throw new errors_1.BadRequestException('You have already placed a bid on this task');
    }
    const bidRepo = data_source_1.AppDataSource.getRepository(Bid_entity_1.Bid);
    const bid = bidRepo.create({
        taskId,
        taskerId,
        amountKobo: String(body.amountKobo),
        message: body.message ?? null,
        status: enums_1.BidStatus.PENDING,
    });
    await bidRepo.save(bid);
    // Reload with tasker relation for DTO
    const saved = await bidService.getBidForTask(taskId, bid.id);
    return toBidDTO(saved);
}
// ─── LIST BIDS ────────────────────────────────────────────────────────────────
async function listBidsLogic(posterId, taskId) {
    const task = await taskService.getTaskById(taskId);
    if (task.posterId !== posterId) {
        throw new errors_1.ForbiddenException('Only the task poster can view all bids');
    }
    const bids = await bidService.listBidsForTask(taskId);
    return bids.map(toBidDTO);
}
// ─── ACCEPT BID ───────────────────────────────────────────────────────────────
async function acceptBidLogic(posterId, taskId, bidId) {
    const task = await taskService.getTaskById(taskId);
    if (task.posterId !== posterId) {
        throw new errors_1.ForbiddenException('Only the task poster can accept a bid');
    }
    if (task.status !== enums_1.TaskStatus.OPEN) {
        throw new errors_1.BadRequestException('Task is not in a state where bids can be accepted');
    }
    const bid = await bidService.getBidForTask(taskId, bidId);
    if (bid.status !== enums_1.BidStatus.PENDING) {
        throw new errors_1.BadRequestException('Only pending bids can be accepted');
    }
    // Accept this bid
    const bidRepo = data_source_1.AppDataSource.getRepository(Bid_entity_1.Bid);
    bid.status = enums_1.BidStatus.ACCEPTED;
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
async function rejectBidLogic(posterId, taskId, bidId) {
    const task = await taskService.getTaskById(taskId);
    if (task.posterId !== posterId) {
        throw new errors_1.ForbiddenException('Only the task poster can reject bids');
    }
    const bid = await bidService.getBidForTask(taskId, bidId);
    if (bid.status !== enums_1.BidStatus.PENDING) {
        throw new errors_1.BadRequestException('Only pending bids can be rejected');
    }
    const bidRepo = data_source_1.AppDataSource.getRepository(Bid_entity_1.Bid);
    bid.status = enums_1.BidStatus.REJECTED;
    await bidRepo.save(bid);
    return toBidDTO(bid);
}
// ─── WITHDRAW BID ─────────────────────────────────────────────────────────────
async function withdrawBidLogic(taskerId, taskId, bidId) {
    const bid = await bidService.getBidForTask(taskId, bidId);
    if (bid.taskerId !== taskerId) {
        throw new errors_1.ForbiddenException('You can only withdraw your own bids');
    }
    if (bid.status !== enums_1.BidStatus.PENDING) {
        throw new errors_1.BadRequestException('Only pending bids can be withdrawn');
    }
    const bidRepo = data_source_1.AppDataSource.getRepository(Bid_entity_1.Bid);
    bid.status = enums_1.BidStatus.WITHDRAWN;
    await bidRepo.save(bid);
    return toBidDTO(bid);
}
//# sourceMappingURL=bid.logic.js.map