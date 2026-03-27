import { Repository } from 'typeorm';
import { AppDataSource, getRepository } from '../connection/data-source';
import { BaseService } from './service';
import { Task } from '../entities/Task.entity';
import { TaskStatus } from '../entities/enums';
import { NotFoundException } from '../errors/errors';

export interface CreateTaskInput {
  posterId: string;
  title: string;
  description: string;
  categoryId?: string;
  latitude: number;
  longitude: number;
  locationDisplay: string;
  locationExact: string;
  budgetKobo: string; // stored as string (PG bigint)
  scheduledFor?: Date;
  durationEstimate?: string;
  mediaUrls?: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  categoryId?: string;
  posterId?: string;
  taskerId?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  minBudget?: number;
  maxBudget?: number;
}

export class TaskService extends BaseService<Task> {
  initRepository(): Repository<Task> {
    return getRepository(Task);
  }

  async createTask(data: CreateTaskInput): Promise<Task> {
    const repo = this.getRepository();
    const task = repo.create({
      posterId: data.posterId,
      title: data.title,
      description: data.description,
      categoryId: data.categoryId ?? null,
      latitude: data.latitude,
      longitude: data.longitude,
      locationDisplay: data.locationDisplay,
      locationExact: data.locationExact,
      budgetKobo: data.budgetKobo,
      status: TaskStatus.DRAFT,
      scheduledFor: data.scheduledFor ?? null,
      durationEstimate: data.durationEstimate ?? null,
      mediaUrls: data.mediaUrls ?? [],
    });
    return repo.save(task);
  }

  async getTaskById(id: string, loadRelations = false): Promise<Task> {
    const repo = this.getRepository();
    const task = await repo.findOne({
      where: { id },
      relations: loadRelations ? ['poster', 'tasker', 'category'] : [],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async findTasksPaginated(
    filters: TaskFilters,
    page: number,
    limit: number,
  ): Promise<{ tasks: Task[]; total: number }> {
    const repo = this.getRepository();
    const qb = repo
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.poster', 'poster')
      .leftJoinAndSelect('task.tasker', 'tasker')
      .leftJoinAndSelect('task.category', 'category');

    if (filters.status) {
      qb.andWhere('task.status = :status', { status: filters.status });
    }
    if (filters.categoryId) {
      qb.andWhere('task.categoryId = :categoryId', { categoryId: filters.categoryId });
    }
    if (filters.posterId) {
      qb.andWhere('task.posterId = :posterId', { posterId: filters.posterId });
    }
    if (filters.taskerId) {
      qb.andWhere('task.taskerId = :taskerId', { taskerId: filters.taskerId });
    }
    if (filters.minBudget != null) {
      qb.andWhere('CAST(task.budgetKobo AS BIGINT) >= :minBudget', {
        minBudget: filters.minBudget,
      });
    }
    if (filters.maxBudget != null) {
      qb.andWhere('CAST(task.budgetKobo AS BIGINT) <= :maxBudget', {
        maxBudget: filters.maxBudget,
      });
    }
    if (filters.lat != null && filters.lng != null && filters.radiusKm) {
      // Haversine formula — filter tasks within radiusKm of (lat, lng)
      qb.andWhere(
        `(6371 * acos(LEAST(1.0, cos(radians(:lat)) * cos(radians(task.latitude)) * cos(radians(task.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(task.latitude))))) <= :radius`,
        { lat: filters.lat, lng: filters.lng, radius: filters.radiusKm },
      );
    }

    qb.orderBy('task.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [tasks, total] = await qb.getManyAndCount();
    return { tasks, total };
  }

  async updateTaskFields(id: string, data: Partial<Task>): Promise<Task> {
    const repo = this.getRepository();
    await repo.update(id, data as any);
    return this.getTaskById(id, true);
  }
}
