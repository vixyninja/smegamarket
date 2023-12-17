import {AuthGuard, HttpInternalServerError, RoleEnum, Roles, RolesGuard} from '@/core';
import * as faker from '@faker-js/faker';
import {Body, Controller, Delete, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors} from '@nestjs/common';
import {FilesInterceptor} from '@nestjs/platform-express';
import {CreateProductInformationDTO} from '../dto';
import {ProductInformationService} from '../services';
import {ProductTypeEnum, ProductSaleEnum, ProductSizeEnum, ProductStatusEnum} from '../enum';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductInformationController {
  constructor(private readonly productInformationService: ProductInformationService) {}

  @Post(':productId/import')
  async importProductInformation(@Param('productId') productId: string) {
    try {
      faker.fakerEN.seed(123);

      let productInformations = [];

      for (let index = 0; index < 3; index++) {
        let dto: CreateProductInformationDTO = {
          type: faker.fakerEN.helpers.arrayElements(Object.values(ProductTypeEnum), 1)[0],
          price: faker.fakerEN.number.int({min: 1000, max: 1000000}),
          description: faker.fakerEN.commerce.productDescription(),
          link: faker.fakerEN.internet.url(),
          sale: faker.fakerEN.helpers.arrayElements(Object.values(ProductSaleEnum), 1)[0],
          size: faker.fakerEN.helpers.uniqueArray(Object.values(ProductSizeEnum), 1)[0],
          status: faker.fakerEN.helpers.arrayElements(Object.values(ProductStatusEnum), 1)[0],
        };

        const productInformation = await this.productInformationService.createProductInformation(productId, dto, []);

        productInformations.push(productInformation);
      }

      return productInformations;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  @Get(':productId/information')
  async getProductInformation() {}

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post(':productId/information')
  @UseInterceptors(FilesInterceptor('files'))
  async createProductInformation(
    @Body() createProductInformationDTO: CreateProductInformationDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {}

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @Post(':productId/information/media')
  async uploadProductInformationMedia(@UploadedFiles() files: Express.Multer.File[]) {}

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Delete(':productId/information/media')
  async deleteProductInformationMedia(@Body('publicId') publicId: string) {}

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Delete(':productId/information')
  async deleteProductInformation() {}
}
