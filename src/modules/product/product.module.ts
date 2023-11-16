import {JWTService} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BrandEntity} from '../brand';
import {CategoryEntity} from '../category';
import {ProductController} from './product.controller';
import {ProductEntity} from './product.entity';
import {ProductService} from './product.service';
import {FileModule} from '../file';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, BrandEntity, CategoryEntity]),
    FileModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService, JWTService],
  exports: [ProductService],
})
export class ProductModule {}
