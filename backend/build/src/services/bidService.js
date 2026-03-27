"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidService = void 0;
const data_source_1 = require("../connection/data-source");
const service_1 = require("./service");
const Bid_entity_1 = require("../entities/Bid.entity");
const enums_1 = require("../entities/enums");
const errors_1 = require("../errors/errors");
class BidService extends service_1.BaseService {
    initRepository() {
        return (0, data_source_1.getRepository)(Bid_entity_1.Bid);
    }
    async getBidById(id) {
        const bid = await this.getRepository().findOne({
            where: { id },
            relations: ['tasker', 'task'],
        });
        if (!bid)
            throw new errors_1.NotFoundException('Bid not found');
        return bid;
    }
    async getBidForTask(taskId, bidId) {
        const bid = await this.getRepository().findOne({
            where: { id: bidId, taskId },
            relations: ['tasker'],
        });
        if (!bid)
            throw new errors_1.NotFoundException('Bid not found on this task');
        return bid;
    }
    async getTaskerBid(taskId, taskerId) {
        return this.getRepository().findOne({ where: { taskId, taskerId } });
    }
    async listBidsForTask(taskId) {
        return this.getRepository().find({
            where: { taskId },
            relations: ['tasker'],
            order: { createdAt: 'ASC' },
        });
    }
    async rejectAllOtherBids(taskId, acceptedBidId) {
        await this.getRepository()
            .createQueryBuilder()
            .update(Bid_entity_1.Bid)
            .set({ status: enums_1.BidStatus.REJECTED })
            .where('taskId = :taskId AND id != :acceptedBidId AND status = :status', {
            taskId,
            acceptedBidId,
            status: enums_1.BidStatus.PENDING,
        })
            .execute();
    }
}
exports.BidService = BidService;
//# sourceMappingURL=bidService.js.map