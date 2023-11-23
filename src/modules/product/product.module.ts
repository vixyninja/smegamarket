import {JWTService} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BrandEntity} from '../brand';
import {CategoryEntity} from '../category';
import {FileModule} from '../file';
import {ProductEntity} from './entities';
import {ProductController} from './product.controller';
import {ProductService} from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, BrandEntity, CategoryEntity]), FileModule],
  controllers: [ProductController],
  providers: [ProductService, JwtService, JWTService],
  exports: [ProductService],
})
export class ProductModule {}
