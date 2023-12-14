import {AuthGuard, HandlerFilter, RoleEnum, Roles, RolesGuard} from '@/core';
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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {FilesInterceptor} from '@nestjs/platform-express';
import {isBase64, isUUID} from 'class-validator';
import {BrandEntity, BrandService} from '../brand';
import {CategoryEntity, CategoryService} from '../category';
import {CreateProductDTO, CreateProductInformationDTO, UpdateProductDTO} from './dto';
import {ProductService} from './product.service';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly brandService: BrandService,
    private readonly cateService: CategoryService,
  ) {}

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post('import')
  async import() {
    let products = [];
    faker.fakerEN.seed(123);

    const categoryData: CategoryEntity[] = await this.cateService.findAll();
    const categories = categoryData.map((category) => category.uuid);
    const brandsData: BrandEntity[] = await this.brandService.readAll();
    const brands = brandsData.map((brand) => brand.uuid);

    for (let index = 0; index < 20; index++) {
      let dto: CreateProductDTO = {
        name: faker.fakerEN.commerce.productName() + ' ' + faker.fakerEN.number.int({min: 1, max: 100}),
        category: faker.fakerEN.helpers.arrayElements(categories, 4),
        brandId: faker.fakerEN.helpers.arrayElements(brands, 1)[0],
        description: faker.fakerEN.commerce.productDescription(),
        detail: faker.fakerEN.commerce.productDescription(),
        link: faker.fakerEN.internet.url(),
      };

      const product = await this.productService.createProduct(dto, []);
      products.push(product);
    }

    return HandlerFilter(products, {
      message: 'SUCCESS',
      data: products,
    });
  }

  @Get()
  async readAll(@Query() query: QueryOptions) {
    const products: any = await this.productService.readAll(query);

    return HandlerFilter(products, {
      message: 'SUCCESS',
      data: products.data,
      meta: products.meta,
    });
  }

  @Get(':productId')
  async readOne(@Param('productId') productId: string) {
    if (!isUUID(productId)) {
      return {
        message: 'Product id is not valid',
      };
    }

    const product = await this.productService.readOne(productId);

    return {
      message: 'SUCCESS',
      data: product,
    };
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  async createProduct(@Body() createProductDTO: CreateProductDTO, @UploadedFiles() files: Express.Multer.File[]) {
    files.forEach((file) => {
      if (!isBase64(Buffer.from(file.buffer).toString('base64'))) {
        return {
          message: 'File is not valid',
        };
      }
    });

    const product = await this.productService.createProduct(createProductDTO, files);

    return HandlerFilter(product, {
      message: 'SUCCESS',
      data: product,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @Put(':productId')
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDTO: UpdateProductDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!isUUID(productId)) {
      return {
        message: 'Product id is not valid',
      };
    }

    files &&
      files.forEach((file) => {
        if (!isBase64(Buffer.from(file.buffer).toString('base64'))) {
          return {
            message: 'File is not valid',
          };
        }
      });

    const product = await this.productService.updateProduct(productId, updateProductDTO, files);
    return HandlerFilter(product, {
      message: 'Update product successfully',
      data: product,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Delete(':productId')
  async delete(@Param('productId') productId: string) {
    if (!isUUID(productId)) {
      return {
        message: 'Product id is not valid',
      };
    }

    const product = await this.productService.deleteProduct(productId);
    return HandlerFilter(product, {
      message: product,
    });
  }
}
