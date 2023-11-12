import {Controller, Get, Param, Post, UseGuards} from '@nestjs/common';
import {BrandService} from './brand.service';
import {AuthGuard, RoleEnum, Roles, RolesGuard} from '@/core';
import {isUUID} from 'class-validator';

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
  async findAll(): Promise<any> {
    return await this.brandService.findAll();
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
}
