import {AuthGuard, HandlerFilter, RoleEnum, Roles, RolesGuard} from '@/core';
import {QueryOptions} from '@/core/interface';
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
import {CreateProductDTO, CreateProductInformationDTO} from './dto';
import {UpdateProductDTO} from './dto/updateProduct.dto';
import {ProductService} from './product.service';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async readAll(@Query() query: QueryOptions) {
    const products: any = await this.productService.readAll(query);

    return HandlerFilter(products, {
      message: 'Get products successfully',
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
      message: 'Get product successfully',
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
      message: 'Create product successfully',
      data: product,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @Post(':productId')
  async createProductInformation(
    @Body() createProductInformationDTO: CreateProductInformationDTO,
    @UploadedFiles() files: Express.Multer.File[],
    @Param('productId') productId: string,
  ) {
    files.forEach((file) => {
      if (!isBase64(Buffer.from(file.buffer).toString('base64'))) {
        return {
          message: 'File is not valid',
        };
      }
    });

    const productInformation = await this.productService.createProductInformation(
      productId,
      createProductInformationDTO,
      files,
    );

    return HandlerFilter(productInformation, {
      message: 'Create product information successfully',
      data: productInformation,
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
