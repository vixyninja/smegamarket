import {Module} from '@nestjs/common';
import {ProductService} from './product.service';
import {ProductController} from './product.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductEntity} from './product.entity';
import {ProductCategory} from './product_category.entity';
import {ProductUpload} from './product_upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductCategory, ProductUpload])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
