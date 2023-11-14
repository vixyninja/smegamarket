import {AuthGuard, RoleEnum, Roles, RolesGuard} from '@/core';
import {IQueryOptions} from '@/core/interface';
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
import {CreateProductDTO} from './dto';
import {ProductService} from './product.service';
import {UpdateProductDTO} from './dto/updateProduct.dto';
import {FilesInterceptor} from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query() query: IQueryOptions) {
    return await this.productService.findAll(query);
  }

  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    return await this.productService.findOne(productId);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createProductDTO: CreateProductDTO) {
    return await this.productService.create(createProductDTO);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put(':productId')
  async update(@Body() updateProductDTO: UpdateProductDTO, @Param('productId') productId: string) {
    return await this.productService.update(productId, updateProductDTO);
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put(':productId/images')
  @UseInterceptors(FilesInterceptor('images'))
  async updateImage(@Param('productId') productId: string, @UploadedFiles() files: Express.Multer.File[]) {
    return await this.productService.updateImage(productId, files);
  }
}
