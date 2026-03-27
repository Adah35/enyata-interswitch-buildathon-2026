import {FindOptionsOrder, FindOptionsWhere, Repository} from "typeorm";
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

export abstract class BaseService<T> {
  repository: Repository<T>;

  constructor(repo?: Repository<T>) {
    this.repository = repo;
  }

  abstract initRepository(): Repository<T>;

  getRepository(): Repository<T> {
    if (!this.repository) {
      return this.initRepository();
    }
    return this.repository;
  }

  batchAdd = async (
    data: QueryDeepPartialEntity<T>[],
    orIgnore = false
  ): Promise<T[]> => {
    const repo = this.getRepository();

    const qB = repo.createQueryBuilder().insert().values(data);
    if (orIgnore) {
      qB.orIgnore();
    }
    await qB.execute();
    return data as T[];
  };

  insert = async (data: QueryDeepPartialEntity<T>): Promise<T> => {
    const repo = this.getRepository();
    await repo.insert([data]);
    return data as T;
  };

  findById = async (id: string | number): Promise<T> => {
    const res = await this.find({ id } as any);
    return res[0];
  };

  find = async (
    where: FindOptionsWhere<T>,
    order?: FindOptionsOrder<T>,
    take?: number
  ): Promise<T[]> => {
    const repo = this.getRepository();
    return await repo.find({
      where,
      order,
      take,
    });
  };

  findOne = async (where: FindOptionsWhere<T>): Promise<T> => {
    const repo = this.getRepository();

    return await repo.findOne({
      where,
    });
  };

  update = async (
    where: FindOptionsWhere<T>,
    update: QueryDeepPartialEntity<T>
  ): Promise<T | null> => {
    const repo = this.getRepository();

    // Fetch and return the updated entity
    const updatedEntity = await repo.findOne({ where });
    const result = await repo.save({ ...updatedEntity, ...update });

    return result;
  };

  updateWithNoResult = async (
    where: FindOptionsWhere<T>,
    update: QueryDeepPartialEntity<T>
  ): Promise<boolean> => {
    const repo = this.getRepository();

    await repo.update(where, update);

    return true;
  };

  remove = async (where: FindOptionsWhere<T>): Promise<boolean> => {
    const repo = this.getRepository();

    await repo.softDelete(where);

    return true;
  };

  hardRemove = async (where: FindOptionsWhere<T>): Promise<boolean> => {
    const repo = this.getRepository();

    await repo.delete(where);

    return true;
  };
}
