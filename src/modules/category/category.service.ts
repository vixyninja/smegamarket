import {HttpBadRequest} from '@/core';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CategoryEntity} from './category.entity';
import {CreateCategoryDTO, UpdateCategoryDTO} from './dto';
import * as faker from '@faker-js/faker';

interface CategoryServiceInterface {
  findAll(): Promise<any>;
  findOne(categoryId: string): Promise<any>;
  create(createCategoryDTO: CreateCategoryDTO): Promise<any>;
  update(
    categoryId: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<any>;
  delete(categoryId: string): Promise<any>;
}

@Injectable()
export class CategoryService implements CategoryServiceInterface {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async import(): Promise<any> {
    try {
      faker.fakerVI.seed();

      let cateRnd: string[] = ['Vegetables', 'Fruits', 'Meat', 'Others'];

      let categories = [];

      for (let i = 0; i < cateRnd.length; i++) {
        var des;
        switch (i) {
          case 0:
            des =
              'Vegetables are parts of plants that are consumed by humans or other animals as food.';
            break;
          case 1:
            des =
              'In botany, a fruit is the seed-bearing structure in flowering plants (also known as angiosperms) formed from the ovary after flowering.';
            break;
          case 2:
            des = 'Meat is animal flesh that is eaten as food.';
            break;
          default:
            des = 'Others';
        }

        const category: CreateCategoryDTO = {
          name: cateRnd[i].toString(),
          description: des,
        };
        categories.push(category);
      }
      const result = await this.categoryRepository.save(categories);

      return {
        message: 'Import categories successfully',
        data: result,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async findAll(): Promise<any> {
    try {
      const categories = await this.categoryRepository.find();
      return {
        message: 'Get categories success',
        data: categories,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
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
      throw new HttpBadRequest(e.message);
    }
  }
  async create(createCategoryDTO: CreateCategoryDTO): Promise<any> {
    try {
      const nameExist = await this.categoryRepository.findOne({
        where: {name: createCategoryDTO.name.trim()},
      });

      if (nameExist) {
        return new HttpBadRequest('Category name already exist');
      }

      const result = await this.categoryRepository.save(createCategoryDTO);
      return {
        message: 'Create category success',
        data: result,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
  async update(
    categoryId: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<any> {
    try {
      const category = await this.categoryRepository.findOne({
        where: {uuid: categoryId},
      });

      if (!category) {
        return new HttpBadRequest('Category not found');
      }

      const updateCategory = await this.categoryRepository.update(
        categoryId,
        updateCategoryDTO,
      );

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
      throw new HttpBadRequest(e.message);
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
        data: null,
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
}
