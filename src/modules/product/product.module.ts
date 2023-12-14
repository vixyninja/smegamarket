import {JWTService} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BrandModule} from '../brand';
import {CategoryModule} from '../category';
import {MediaModule} from '../media';
import {ProductEntity, ProductInformationEntity} from './entities';
import {ProductController} from './product.controller';
import {ProductService} from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductInformationEntity]),
    MediaModule,
    CategoryModule,
    BrandModule,
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService, JWTService],
  exports: [ProductService],
})
export class ProductModule {}
