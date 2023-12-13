import {AuthGuard, HandlerFilter, HttpInternalServerError, RoleEnum, Roles, RolesGuard} from '@/core';
import {QueryOptions} from '@/core/interface';
import * as faker from '@faker-js/faker';
import {CacheInterceptor} from '@nestjs/cache-manager';
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
      faker.fakerEN.seed(124);
      let brands = [];
      for (let i = 0; i < 10; i++) {
        const brand = new BrandEntity();
        brand.name = faker.fakerEN.company.name();
        brand.description = faker.fakerEN.company.catchPhraseDescriptor();
        brand.address = faker.fakerEN.location.streetAddress();
        brand.phone = faker.fakerEN.phone.number();
        brand.email = faker.fakerEN.internet.email();
        brand.website = faker.fakerEN.internet.url();
        let res = await this.brandService.create(brand, null);
        brands.push(res);
      }
      return {
        message: 'SUCCESS',
        data: brands,
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  async getAll(): Promise<any> {
    const brands = await this.brandService.readAll();

    return HandlerFilter(brands, {
      message: 'SUCCESS',
      data: brands,
    });
  }

  @Get('q')
  @UseInterceptors(CacheInterceptor)
  async query(@Query() query: QueryOptions): Promise<any> {
    const brands = await this.brandService.query(query);

    return HandlerFilter(brands, {
      message: 'SUCCESS',
      data: brands.data,
      meta: brands.meta,
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
      message: 'SUCCESS',
      data: brand,
    });
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<any> {
    const brand = await this.brandService.readName(name);

    return HandlerFilter(brand, {
      message: 'SUCCESS',
      data: brand,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Post()
  async create(@Body() createBrandDTO: CreateBrandDTO, @UploadedFile() avatar: Express.Multer.File): Promise<any> {
    const brand = await this.brandService.create(createBrandDTO, avatar);

    if (avatar && !isBase64(avatar.buffer.toString('base64'))) {
      return {
        message: 'Image is not valid',
      };
    }

    return HandlerFilter(brand, {
      message: 'SUCCESS',
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
      message: 'SUCCESS',
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
