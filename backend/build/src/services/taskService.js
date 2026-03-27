"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const data_source_1 = require("../connection/data-source");
const service_1 = require("./service");
const Task_entity_1 = require("../entities/Task.entity");
const enums_1 = require("../entities/enums");
const errors_1 = require("../errors/errors");
class TaskService extends service_1.BaseService {
    initRepository() {
        return (0, data_source_1.getRepository)(Task_entity_1.Task);
    }
    async createTask(data) {
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
            status: enums_1.TaskStatus.DRAFT,
            scheduledFor: data.scheduledFor ?? null,
            durationEstimate: data.durationEstimate ?? null,
            mediaUrls: data.mediaUrls ?? [],
        });
        return repo.save(task);
    }
    async getTaskById(id, loadRelations = false) {
        const repo = this.getRepository();
        const task = await repo.findOne({
            where: { id },
            relations: loadRelations ? ['poster', 'tasker', 'category'] : [],
        });
        if (!task)
            throw new errors_1.NotFoundException('Task not found');
        return task;
    }
    async findTasksPaginated(filters, page, limit) {
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
            qb.andWhere(`(6371 * acos(LEAST(1.0, cos(radians(:lat)) * cos(radians(task.latitude)) * cos(radians(task.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(task.latitude))))) <= :radius`, { lat: filters.lat, lng: filters.lng, radius: filters.radiusKm });
        }
        qb.orderBy('task.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [tasks, total] = await qb.getManyAndCount();
        return { tasks, total };
    }
    async updateTaskFields(id, data) {
        const repo = this.getRepository();
        await repo.update(id, data);
        return this.getTaskById(id, true);
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=taskService.js.map