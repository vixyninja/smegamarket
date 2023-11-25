import {HttpBadRequest, HttpInternalServerError, HttpNotFound} from '@/core';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateCategoryDTO, UpdateCategoryDTO} from './dto';
import {CategoryEntity} from './entities';
import {FileService} from '../file';

interface CategoryServiceInterface {
  findAll(): Promise<any>;
  findOne(categoryId: string): Promise<any>;
  create(arg: CreateCategoryDTO): Promise<any>;
  update(categoryId: string, arg: UpdateCategoryDTO): Promise<any>;
  updateIcon(categoryId: string, file: Express.Multer.File): Promise<any>;
  delete(categoryId: string): Promise<any>;
}

@Injectable()
export class CategoryService implements CategoryServiceInterface {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly fileService: FileService,
  ) {}

  async findAll(): Promise<any> {
    try {
      const categories = await this.categoryRepository.createQueryBuilder('category').loadAllRelationIds().getMany();

      return categories;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async findOne(categoryId: string): Promise<any> {
    try {
      const category = await this.categoryRepository
        .createQueryBuilder('category')
        .loadAllRelationIds()
        .where('category.uuid = :uuid', {uuid: categoryId})
        .getOne();

      if (!category) {
        return new HttpBadRequest('Category not found');
      }

      return category;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async create(arg: CreateCategoryDTO): Promise<any> {
    try {
      const {description, name} = arg;

      const nameExist = await this.categoryRepository.findOne({
        where: {name: name},
      });

      if (nameExist) {
        return new HttpBadRequest('Category name already exist');
      }

      const defaultIcon = await this.fileService.findFile('7fa8a45a-bdfe-4674-a497-fbbf7e670639');

      const createCategory = await this.categoryRepository
        .createQueryBuilder('category')
        .insert()
        .into(CategoryEntity)
        .values({
          name: name,
          description: description,
          icon: defaultIcon,
        })
        .execute();

      if (!createCategory) {
        return new HttpBadRequest('Error creating category');
      }

      const result = await this.findOne(createCategory.raw.insertId);

      if (!result) {
        return new HttpBadRequest('Error creating category');
      }

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async update(categoryId: string, arg: UpdateCategoryDTO): Promise<any> {
    try {
      const {description, name} = arg;

      const isExist = await this.categoryRepository.findOne({
        where: {uuid: categoryId},
      });

      if (!isExist) {
        return new HttpNotFound('Category not found');
      }

      const updateCategory = await this.categoryRepository
        .createQueryBuilder('category')
        .update(CategoryEntity)
        .set({
          name: name ?? isExist.name,
          description: description ?? isExist.description,
        })
        .where('uuid = :uuid', {uuid: categoryId})
        .execute();

      if (!updateCategory) {
        return new HttpBadRequest('Error updating category');
      }

      const result = await this.findOne(categoryId);

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateIcon(categoryId: string, file: Express.Multer.File): Promise<any> {
    try {
      const category = await this.categoryRepository
        .createQueryBuilder('category')
        .where('uuid = :uuid', {uuid: categoryId})
        .getOne();

      if (!category) {
        return new HttpNotFound('Category not found');
      }

      const icon = await this.fileService.uploadFile(file);

      const updateIconCategory = await this.categoryRepository
        .createQueryBuilder('category')
        .update(CategoryEntity)
        .set({
          icon: icon,
        })
        .where('uuid = :uuid', {uuid: categoryId})
        .execute();

      if (!updateIconCategory) {
        return new HttpBadRequest('Error updating category');
      }

      const result = await this.findOne(categoryId);

      if (!result) return new HttpBadRequest('Error updating category');

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async delete(categoryId: string): Promise<any> {
    try {
      const result = await this.categoryRepository
        .createQueryBuilder()
        .delete()
        .from(CategoryEntity)
        .where('uuid = :uuid', {uuid: categoryId})
        .execute();

      if (!result) {
        return new HttpBadRequest('Error deleting category');
      }

      return 'Deleted successfully';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
