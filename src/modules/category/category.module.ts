import {JWTService} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MediaModule} from '../media';
import {CategoryController} from './category.controller';
import {CategoryService} from './category.service';
import {CategoryEntity} from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), MediaModule],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService, JWTService],
  exports: [CategoryService],
})
export class CategoryModule {}
