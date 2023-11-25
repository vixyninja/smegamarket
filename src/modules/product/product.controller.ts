import {AuthGuard, RoleEnum, Roles, RolesGuard} from '@/core';
import {QueryOptions} from '@/core/interface';
import {
  Body,
  Controller,
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
import {CreateProductDTO} from './dto';
import {UpdateProductDTO} from './dto/updateProduct.dto';
import {ProductEntity} from './entities';
import {ProductService} from './product.service';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async readAll(@Query() query: QueryOptions) {
    const products: any = await this.productService.readAll(query);
    return {
      message: 'Get products successfully',
      data: products.data,
      meta: products.meta,
    };
  }

  @Get(':productId')
  async readOne(@Param('productId') productId: string) {
    const product: ProductEntity = await this.productService.readOne(productId);
    return {
      message: 'Get product successfully',
      data: product,
    };
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createProductDTO: CreateProductDTO) {
    const product: ProductEntity = await this.productService.create(createProductDTO);
    return {
      message: 'Create product successfully',
      data: product,
    };
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put(':productId')
  async update(@Body() updateProductDTO: UpdateProductDTO, @Param('productId') productId: string) {
    const product: ProductEntity = await this.productService.update(productId, updateProductDTO);
    return {
      message: 'Update product successfully',
      data: product,
    };
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put(':productId/images')
  @UseInterceptors(FilesInterceptor('images'))
  async updateImage(@Param('productId') productId: string, @UploadedFiles() files: Express.Multer.File[]) {
    const product: ProductEntity = await this.productService.updateImage(productId, files);
    return {
      message: 'Update product image successfully',
      data: product,
    };
  }
}
