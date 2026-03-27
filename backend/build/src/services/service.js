"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(repo) {
        this.batchAdd = async (data, orIgnore = false) => {
            const repo = this.getRepository();
            const qB = repo.createQueryBuilder().insert().values(data);
            if (orIgnore) {
                qB.orIgnore();
            }
            await qB.execute();
            return data;
        };
        this.insert = async (data) => {
            const repo = this.getRepository();
            await repo.insert([data]);
            return data;
        };
        this.findById = async (id) => {
            const res = await this.find({ id });
            return res[0];
        };
        this.find = async (where, order, take) => {
            const repo = this.getRepository();
            return await repo.find({
                where,
                order,
                take,
            });
        };
        this.findOne = async (where) => {
            const repo = this.getRepository();
            return await repo.findOne({
                where,
            });
        };
        this.update = async (where, update) => {
            const repo = this.getRepository();
            // Fetch and return the updated entity
            const updatedEntity = await repo.findOne({ where });
            const result = await repo.save({ ...updatedEntity, ...update });
            return result;
        };
        this.updateWithNoResult = async (where, update) => {
            const repo = this.getRepository();
            await repo.update(where, update);
            return true;
        };
        this.remove = async (where) => {
            const repo = this.getRepository();
            await repo.softDelete(where);
            return true;
        };
        this.hardRemove = async (where) => {
            const repo = this.getRepository();
            await repo.delete(where);
            return true;
        };
        this.repository = repo;
    }
    getRepository() {
        if (!this.repository) {
            return this.initRepository();
        }
        return this.repository;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=service.js.map