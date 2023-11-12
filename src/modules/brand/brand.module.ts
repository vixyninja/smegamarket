import {JWTService} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {FileModule} from '../file';
import {BrandController} from './brand.controller';
import {BrandEntity} from './brand.entity';
import {BrandService} from './brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity]), FileModule],
  controllers: [BrandController],
  providers: [BrandService, JwtService, JWTService],
  exports: [BrandService],
})
export class BrandModule {}
