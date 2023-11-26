import {AuthGuard, HandlerFilter, HttpInternalServerError, RoleEnum, Roles, RolesGuard} from '@/core';
import {QueryOptions} from '@/core/interface';
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
import {isBase64, isUUID} from 'class-validator';
import {BrandService} from './brand.service';
import {CreateBrandDTO, UpdateBrandDTO} from './dto';
import {BrandEntity} from './entities';

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
        brand.name = faker.fakerVI.commerce.department();
        brand.description = faker.fakerVI.lorem.paragraph();
        brand.address = faker.fakerVI.location.streetAddress();
        brand.phone = faker.fakerVI.phone.number();
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
  async findAll(@Query() query: QueryOptions): Promise<any> {
    const brands = await this.brandService.findAll(query);

    return HandlerFilter(brands, {
      message: 'Get brands successfully',
      data: brands.data,
      meta: brands.meta,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  async create(@Body() createBrandDTO: CreateBrandDTO, @UploadedFile() avatar: Express.Multer.File): Promise<any> {
    const brand = await this.brandService.create(createBrandDTO, avatar);

    if (!isBase64(avatar.buffer.toString('base64'))) {
      return {
        message: 'Image is not valid',
      };
    }

    return HandlerFilter(brand, {
      message: 'Create brand successfully',
      data: brand,
    });
  }

  @Get(':brandId')
  async readOne(@Param('brandId') brandId: string): Promise<any> {
    if (isUUID(brandId) === false) {
      return {
        message: 'uuid is not valid',
      };
    }
    const brand = await this.brandService.readOne(brandId);

    return HandlerFilter(brand, {
      message: 'Get brand successfully',
      data: brand,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Put(':brandId')
  async update(
    @Body() updateBrandDTO: UpdateBrandDTO,
    @Param('brandId') brandId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    if (isUUID(brandId) === false) {
      return {
        message: 'uuid is not valid',
      };
    }

    if (file && !isBase64(Buffer.from(file.buffer).toString('base64'))) {
      return {
        message: 'Image is not valid',
      };
    }

    const brand = await this.brandService.update(brandId, updateBrandDTO, file);

    return HandlerFilter(brand, {
      message: 'Update brand successfully',
      data: brand,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Delete(':brandId')
  async delete(@Param('brandId') brandId: string): Promise<any> {
    if (isUUID(brandId) === false) {
      return {
        message: 'uuid is not valid',
      };
    }
    const message = await this.brandService.delete(brandId);

    return HandlerFilter(message, {
      message: message,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Delete(':brandId/avatar')
  async deleteAvatar(@Param('brandId') brandId: string): Promise<any> {
    if (isUUID(brandId) === false) {
      return {
        message: 'uuid is not valid',
      };
    }
    const brand = await this.brandService.deleteImage(brandId);

    return HandlerFilter(brand, {
      message: brand,
    });
  }
}
