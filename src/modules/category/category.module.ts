import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CategoryController} from './category.controller';
import {CategoryEntity} from './entities/category.entity';
import {CategoryService} from './category.service';
import {JwtService} from '@nestjs/jwt';
import {JWTService} from '@/configs';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, JwtService, JWTService],
  exports: [CategoryService],
})
export class CategoryModule {}
