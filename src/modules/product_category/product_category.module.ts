import {Module} from '@nestjs/common';
import {ProductCategoryService} from './product_category.service';
import {ProductCategoryController} from './product_category.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductCategory} from './product_category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
