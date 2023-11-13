import {Module} from '@nestjs/common';
import {ProductService} from './product.service';
import {ProductController} from './product.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductEntity} from './product.entity';
import {CategoryEntity} from '../category';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, CategoryEntity])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
