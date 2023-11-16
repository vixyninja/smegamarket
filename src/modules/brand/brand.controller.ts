import {AuthGuard, RoleEnum, Roles, RolesGuard} from '@/core';
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
import {isUUID} from 'class-validator';
import {BrandService} from './brand.service';
import {CreateBrandDTO, UpdateBrandDTO} from './dto';
import {FileInterceptor} from '@nestjs/platform-express';
import {IQueryOptions} from '@/core/interface';

@UseGuards(AuthGuard)
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post('import')
  async import(): Promise<any> {
    return await this.brandService.import();
  }

  @Get()
  async findAll(@Query() query: IQueryOptions): Promise<any> {
    return await this.brandService.findAll(query);
  }

  @Get(':brandId')
  async findOne(@Param('brandId') brandId: string): Promise<any> {
    if (isUUID(brandId) === false) {
      return {
        message: 'Brand not found',
      };
    }
    return await this.brandService.findOne(brandId);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async create(
    @Body() createBrandDTO: CreateBrandDTO,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return await this.brandService.create(createBrandDTO, file);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put(':brandId')
  async update(
    @Body() updateBrandDTO: UpdateBrandDTO,
    @Param('brandId') brandId: string,
  ): Promise<any> {
    return await this.brandService.update(brandId, updateBrandDTO);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put(':brandId/logo')
  @UseInterceptors(FileInterceptor('file'))
  async updateImageId(
    @Param('brandId') brandId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return await this.brandService.updateImage(brandId, file);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Delete(':brandId')
  async delete(@Param('brandId') brandId: string): Promise<any> {
    return await this.brandService.delete(brandId);
  }
}
