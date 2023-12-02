import {AuthGuard, HandlerFilter, HttpInternalServerError, RoleEnum, Roles, RolesGuard} from '@/core';
import * as faker from '@faker-js/faker';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {isBase64, isUUID} from 'class-validator';
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
      faker.fakerVI.seed(123);

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
          name: cateRnd[i].toString() + i,
          description: faker.fakerVI.lorem.paragraph(),
        };
        const response = await this.categoryService.create(category, null);
        result.push(response);
      }

      return HandlerFilter(result, {
        message: 'Import categories successfully',
        data: result,
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  @Get()
  async findAll(): Promise<any> {
    const categories = await this.categoryService.findAll();

    return HandlerFilter(categories, {
      message: 'Get all categories successfully',
      data: categories,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('icon'))
  @Post()
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
    @UploadedFile() icon: Express.Multer.File,
  ): Promise<any> {
    if (icon && !isBase64(Buffer.from(icon.buffer).toString('base64'))) {
      return {
        message: 'Image is not valid',
      };
    }

    const category = await this.categoryService.create(createCategoryDTO, icon);

    return HandlerFilter(category, {
      message: 'Create category successfully',
      data: category,
    });
  }

  @Get(':categoryId')
  async readOne(@Param('categoryId') categoryId: string): Promise<any> {
    if (isUUID(categoryId) === false) {
      return {
        message: 'Category id is invalid',
        data: null,
      };
    }
    const category = await this.categoryService.readOne(categoryId);
    return HandlerFilter(category, {
      message: 'Get category successfully',
      data: category,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put(':categoryId')
  async updateCategory(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (isUUID(categoryId) === false) {
      return {
        message: 'Category id is invalid',
        data: null,
      };
    }

    if (file && !isBase64(Buffer.from(file.buffer).toString('base64'))) {
      return {
        message: 'Image is not valid',
      };
    }

    const category = await this.categoryService.update(categoryId, updateCategoryDTO, file);
    return HandlerFilter(category, {
      message: 'Update category successfully',
      data: category,
    });
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
    return HandlerFilter(category, {
      message: category,
    });
  }
}
