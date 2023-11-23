import {HttpBadRequest, HttpInternalServerError} from '@/core';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CategoryEntity} from './category.entity';
import {CreateCategoryDTO, UpdateCategoryDTO} from './dto';

interface CategoryServiceInterface {
  findAll(): Promise<any>;
  findOne(categoryId: string): Promise<any>;
  create(arg: CreateCategoryDTO): Promise<any>;
  update(categoryId: string, arg: UpdateCategoryDTO): Promise<any>;
  delete(categoryId: string): Promise<any>;
}

@Injectable()
export class CategoryService implements CategoryServiceInterface {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<any> {
    try {
      const categories = await this.categoryRepository.find();

      return {
        message: 'Get categories success',
        data: categories ? categories : [],
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
  async findOne(categoryId: string): Promise<any> {
    try {
      const category = await this.categoryRepository.findOne({
        where: {uuid: categoryId},
      });

      if (!category) {
        return new HttpBadRequest('Category not found');
      }

      return {
        message: 'Get category success',
        data: category,
      };
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

      const result = await this.categoryRepository.save({
        name: name,
        description: description,
      });

      if (!result) {
        return new HttpBadRequest('Error creating category');
      }

      return {
        message: 'Create category success',
        data: result,
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async update(categoryId: string, arg: UpdateCategoryDTO): Promise<any> {
    try {
      const {description, name} = arg;

      const category = await this.categoryRepository.findOne({
        where: {uuid: categoryId},
      });

      if (!category) {
        return new HttpBadRequest('Category not found');
      }

      const updateCategory = await this.categoryRepository.update(categoryId, {
        name: name ?? category.name,
        description: description ?? category.description,
      });

      if (!updateCategory) {
        return new HttpBadRequest('Error updating category');
      }

      const result = await this.categoryRepository.findOne({
        where: {uuid: categoryId},
      });

      return {
        message: 'Update category success',
        data: result,
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async delete(categoryId: string): Promise<any> {
    try {
      const category = await this.categoryRepository.findOne({
        where: {uuid: categoryId},
      });

      if (!category) {
        return new HttpBadRequest('Category not found');
      }

      const deleteCategory = await this.categoryRepository.delete(categoryId);

      if (!deleteCategory) {
        return new HttpBadRequest('Error deleting category');
      }

      return {
        message: 'Delete category success',
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
