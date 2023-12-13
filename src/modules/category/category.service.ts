import {CACHE_KEY, CACHE_KEY_TTL, HttpBadRequest, HttpInternalServerError, HttpNotFound} from '@/core';
import {Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {MediaEntity, MediaService} from '../media';
import {CreateCategoryDTO, UpdateCategoryDTO} from './dto';
import {CategoryEntity} from './entities';
import {RedisxService} from '@/configs';

interface CategoryServiceInterface {
  findAll(): Promise<any>;
  findOne(categoryId: string): Promise<any>;
  findMany(categoryIds: string[]): Promise<any>;
  create(arg: CreateCategoryDTO, file: Express.Multer.File): Promise<any>;
  readOne(categoryId: string): Promise<any>;
  update(categoryId: string, arg: UpdateCategoryDTO, file: Express.Multer.File): Promise<any>;
  delete(categoryId: string): Promise<any>;
}

@Injectable()
export class CategoryService implements CategoryServiceInterface {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly mediaService: MediaService,
    private readonly redisxService: RedisxService,
  ) {}

  async findAll(): Promise<any> {
    try {
      return await this.categoryRepository.createQueryBuilder('category').loadAllRelationIds().getMany();
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

      return category;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async findMany(categoryIds: string[]): Promise<any> {
    try {
      const categories = await this.categoryRepository
        .createQueryBuilder('category')
        .loadAllRelationIds()
        .where('category.uuid IN (:...uuid)', {uuid: categoryIds})
        .getMany();

      return categories;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readOne(categoryId: string): Promise<any> {
    try {
      return await this.redisxService.wrap(
        `${CACHE_KEY.CATEGORY}:${categoryId}`,
        async () => {
          const category = await this.categoryRepository
            .createQueryBuilder('category')
            .loadAllRelationIds()
            .where('category.uuid = :uuid', {uuid: categoryId})
            .getOne();

          if (!category) {
            return new HttpBadRequest('Category not found');
          }
        },
        CACHE_KEY_TTL.CATEGORY,
      );
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async create(arg: CreateCategoryDTO, file: Express.Multer.File): Promise<any> {
    try {
      const {description, name} = arg;

      var _description: string, _name: string;
      var _icon: MediaEntity;

      const nameExist = await this.categoryRepository.findOne({
        where: {name: name},
      });

      if (nameExist) {
        return new HttpBadRequest('Category name already exist');
      }

      _name = name ?? '';
      _description = description ?? '';

      if (file) {
        _icon = await this.mediaService.uploadFile(file);
      } else {
        // _icon = await this.mediaService.findFile('2c3659a3-c8f9-421a-998f-74c2a119a87c');
      }

      const createCategory = await this.categoryRepository
        .createQueryBuilder('category')
        .insert()
        .into(CategoryEntity)
        .values({
          name: _name,
          description: _description,
          icon: _icon,
        })
        .execute();

      if (!createCategory) {
        return new HttpBadRequest('Error creating category');
      }

      const result = await this.findOne(createCategory.raw[0].uuid);

      if (!result) {
        return new HttpBadRequest('Error creating category');
      }

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async update(categoryId: string, arg: UpdateCategoryDTO, file: Express.Multer.File): Promise<any> {
    try {
      const {description, name} = arg;

      const isExist = await this.categoryRepository.findOne({
        where: {uuid: categoryId},
      });

      if (!isExist) {
        return new HttpNotFound('Category not found');
      }

      var _description: string, _name: string;
      var _file: MediaEntity;

      if (file) {
        const temp = await this.mediaService.uploadFile(file);

        if (!temp) {
          return new HttpBadRequest('Error uploading image');
        }

        _file = temp;
      } else {
        _file = isExist.icon;
      }

      _description = description ?? isExist.description;
      _name = name ?? isExist.name;

      const updateCategory = await this.categoryRepository
        .createQueryBuilder('category')
        .update(CategoryEntity)
        .set({
          name: _name,
          description: _description,
          icon: _file,
        })
        .where('uuid = :uuid', {uuid: categoryId})
        .execute();

      if (!updateCategory) {
        return new HttpBadRequest('Error updating category');
      }

      return await this.redisxService.forceWrap(
        `${CACHE_KEY.CATEGORY}:${categoryId}`,
        async () => {
          const result = await this.findOne(categoryId);

          if (!result) {
            return new HttpBadRequest('Error updating category');
          }

          return result;
        },
        CACHE_KEY_TTL.CATEGORY,
      );
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

      await this.redisxService.delKey(`${CACHE_KEY.CATEGORY}:${categoryId}`);

      return 'Deleted successfully';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
