import { Repository } from 'typeorm';
import { getRepository } from '../connection/data-source';
import { BaseService } from './service';
import { Bid } from '../entities/Bid.entity';
import { BidStatus } from '../entities/enums';
import { NotFoundException } from '../errors/errors';

export class BidService extends BaseService<Bid> {
  initRepository(): Repository<Bid> {
    return getRepository(Bid);
  }

  async getBidById(id: string): Promise<Bid> {
    const bid = await this.getRepository().findOne({
      where: { id },
      relations: ['tasker', 'task'],
    });
    if (!bid) throw new NotFoundException('Bid not found');
    return bid;
  }

  async getBidForTask(taskId: string, bidId: string): Promise<Bid> {
    const bid = await this.getRepository().findOne({
      where: { id: bidId, taskId },
      relations: ['tasker'],
    });
    if (!bid) throw new NotFoundException('Bid not found on this task');
    return bid;
  }

  async getTaskerBid(taskId: string, taskerId: string): Promise<Bid | null> {
    return this.getRepository().findOne({ where: { taskId, taskerId } });
  }

  async listBidsForTask(taskId: string): Promise<Bid[]> {
    return this.getRepository().find({
      where: { taskId },
      relations: ['tasker'],
      order: { createdAt: 'ASC' },
    });
  }

  async rejectAllOtherBids(taskId: string, acceptedBidId: string): Promise<void> {
    await this.getRepository()
      .createQueryBuilder()
      .update(Bid)
      .set({ status: BidStatus.REJECTED })
      .where('taskId = :taskId AND id != :acceptedBidId AND status = :status', {
        taskId,
        acceptedBidId,
        status: BidStatus.PENDING,
      })
      .execute();
  }
}
