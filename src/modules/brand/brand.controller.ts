import {AuthGuard, HttpInternalServerError, RoleEnum, Roles, RolesGuard} from '@/core';
import {IQueryOptions} from '@/core/interface';
import * as faker from '@faker-js/faker';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {isUUID} from 'class-validator';
import {BrandEntity} from './entities/brand.entity';
import {BrandService} from './brand.service';
import {CreateBrandDTO, UpdateBrandDTO} from './dto';

@UseGuards(AuthGuard)
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post('import')
  async import(): Promise<any> {
    try {
      faker.fakerVI.seed(124);
      for (let i = 0; i < 8; i++) {
        const brand = new BrandEntity();
        brand.name = faker.fakerVI.commerce.department() + i;
        brand.description = faker.fakerVI.lorem.paragraph();
        brand.address = faker.fakerVI.location.streetAddress();
        brand.phoneNumber = faker.fakerVI.phone.number();
        brand.email = faker.fakerVI.internet.email();
        brand.website = faker.fakerVI.internet.url();
        await this.brandService.create(brand, null);
      }
      return {
        message: 'Brands imported successfully',
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  @Get()
  async findAll(@Query() query: IQueryOptions): Promise<any> {
    return await this.brandService.findAll(query);
  }

  @Get(':brandId')
  async findOne(@Param('brandId') brandId: string): Promise<any> {
    if (isUUID(brandId) === false) {
      return {
        message: 'uuid is not valid',
      };
    }
    return await this.brandService.findOne(brandId);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  async create(@Body() createBrandDTO: CreateBrandDTO, @UploadedFile() avatar: Express.Multer.File): Promise<any> {
    return await this.brandService.create(createBrandDTO, avatar);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put(':brandId')
  async update(@Body() updateBrandDTO: UpdateBrandDTO, @Param('brandId') brandId: string): Promise<any> {
    if (isUUID(brandId) === false) {
      return {
        message: 'uuid is not valid',
      };
    }
    return await this.brandService.update(brandId, updateBrandDTO);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put(':brandId/logo')
  @UseInterceptors(FileInterceptor('file'))
  async updateImageId(@Param('brandId') brandId: string, @UploadedFile() file: Express.Multer.File): Promise<any> {
    if (isUUID(brandId) === false) {
      return {
        message: 'uuid is not valid',
      };
    }
    return await this.brandService.updateImage(brandId, file);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Delete()
  async delete(@Body() brandId: {brandId: string}): Promise<any> {
    if (isUUID(brandId.brandId) === false) {
      return {
        message: 'uuid is not valid',
      };
    }
    return await this.brandService.delete(brandId.brandId);
  }
}
