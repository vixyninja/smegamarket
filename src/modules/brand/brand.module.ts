import {JWTService} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MediaEntity} from '../media';
import {BrandController} from './brand.controller';
import {BrandService} from './brand.service';
import {BrandEntity} from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity]), MediaEntity],
  controllers: [BrandController],
  providers: [BrandService, JwtService, JWTService],
  exports: [BrandService],
})
export class BrandModule {}
