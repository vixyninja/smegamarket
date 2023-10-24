import {BaseEntity, DeleteResult, FindOneOptions, FindOptionsWhere, Repository} from 'typeorm';

export interface IBaseCrud<T> {
  getAll(): Promise<T[]>;
  getById(uuid: FindOneOptions<T>): Promise<T>;
  create(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(uuid: FindOptionsWhere<T>): Promise<DeleteResult>;
  getRepository(): Repository<T>;
  getEntity(): T;
}

export class BaseCrudService<T extends BaseEntity> implements IBaseCrud<T> {
  constructor(private readonly repository: Repository<T>, private readonly entity: T) {}
  async getAll(): Promise<T[]> {
    return await this.repository.find();
  }
  async getById(uuid: FindOneOptions<T>): Promise<T> {
    return await this.repository.findOne(uuid);
  }
  async create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }
  async update(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }
  async delete(uuid: FindOptionsWhere<T>): Promise<DeleteResult> {
    return await this.repository.delete(uuid);
  }
  getRepository(): Repository<T> {
    return this.repository;
  }
  getEntity(): T {
    return this.entity;
  }
}
