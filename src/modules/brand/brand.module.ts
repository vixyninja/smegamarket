import {JWTService, RedisxModule} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MediaModule} from '../media';
import {BrandController} from './brand.controller';
import {BrandService} from './brand.service';
import {BrandEntity} from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([BrandEntity]), MediaModule, RedisxModule],
  controllers: [BrandController],
  providers: [BrandService, JwtService, JWTService],
  exports: [BrandService],
})
export class BrandModule {}
