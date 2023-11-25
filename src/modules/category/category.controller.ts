import {AuthGuard, HttpInternalServerError, RoleEnum, Roles, RolesGuard} from '@/core';
import * as faker from '@faker-js/faker';
import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {isUUID} from 'class-validator';
import {CategoryService} from './category.service';
import {CreateCategoryDTO, UpdateCategoryDTO} from './dto';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post('import')
  async import(): Promise<any> {
    try {
      faker.fakerVI.seed();

      let cateRnd: string[] = [
        'Vegetables',
        'Fruits',
        'Meat',
        'Cooking',
        'Beverages',
        'Snacks',
        'Beer',
        'Wine',
        'Seafood',
        'Dairy',
        'Bread',
        'Canned',
        'Others',
      ];

      let result = [];

      for (let i = 0; i < cateRnd.length; i++) {
        const category: CreateCategoryDTO = {
          name: cateRnd[i].toString(),
          description: faker.fakerVI.lorem.paragraph(),
        };

        const response = await this.categoryService.create(category);

        result.push(response);
      }

      return {
        message: 'Import categories successfully',
        data: result,
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  @Get()
  async findAll(): Promise<any> {
    const categories = await this.categoryService.findAll();
    return {
      message: 'Get all categories successfully',
      data: categories,
    };
  }

  @Get(':categoryId')
  async findOne(@Param('categoryId') categoryId: string): Promise<any> {
    if (isUUID(categoryId) === false) {
      return {
        message: 'Category id is invalid',
        data: null,
      };
    }
    const category = await this.categoryService.findOne(categoryId);
    return {
      message: 'Get category successfully',
      data: category,
    };
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post()
  async createCategory(@Body() createCategoryDTO: CreateCategoryDTO): Promise<any> {
    const category = await this.categoryService.create(createCategoryDTO);
    return {
      message: 'Create category successfully',
      data: category,
    };
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put(':categoryId')
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<any> {
    console.log('categoryId', categoryId);
    if (isUUID(categoryId) === false) {
      return {
        message: 'Category id is invalid',
        data: null,
      };
    }
    const category = await this.categoryService.update(categoryId, updateCategoryDTO);
    return {
      message: 'Update category successfully',
      data: category,
    };
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Delete(':categoryId')
  async deleteCategory(@Param('categoryId') categoryId: string): Promise<any> {
    if (isUUID(categoryId) === false) {
      return {
        message: 'Category id is invalid',
        data: null,
      };
    }
    const category = await this.categoryService.delete(categoryId);
    return {
      message: 'Delete category successfully',
      data: category,
    };
  }
}
