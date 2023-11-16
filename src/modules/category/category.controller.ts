import {AuthGuard, RoleEnum, Roles, RolesGuard} from '@/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {isUUID} from 'class-validator';
import {CategoryService} from './category.service';
import {CreateCategoryDTO, UpdateCategoryDTO} from './dto';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<any> {
    return await this.categoryService.findAll();
  }

  @Get(':categoryId')
  async findOne(@Param('categoryId') categoryId: string): Promise<any> {
    if (isUUID(categoryId) === false) {
      return {
        message: 'Category id is invalid',
        data: null,
      };
    }
    return await this.categoryService.findOne(categoryId);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post('import')
  async import(): Promise<any> {
    return await this.categoryService.import();
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post()
  async createCategory(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<any> {
    return await this.categoryService.create(createCategoryDTO);
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
    return await this.categoryService.update(categoryId, updateCategoryDTO);
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
    return await this.categoryService.delete(categoryId);
  }
}
