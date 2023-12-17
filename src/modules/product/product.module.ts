import {JWTService} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BrandModule} from '../brand';
import {CategoryModule} from '../category';
import {MediaModule} from '../media';
import {ProductController, ProductInformationController} from './controllers';
import {ProductEntity, ProductInformationEntity} from './entities';
import {ProductInformationService, ProductService} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductInformationEntity]),
    MediaModule,
    CategoryModule,
    BrandModule,
  ],
  controllers: [ProductController, ProductInformationController],
  providers: [ProductService, JwtService, JWTService, ProductInformationService],
  exports: [ProductService],
})
export class ProductModule {}
