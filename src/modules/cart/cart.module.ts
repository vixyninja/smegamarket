import {JWTService, RedisxModule} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductModule} from '../product';
import {UserModule} from '../user';
import {CartController} from './cart.controller';
import {CartService} from './cart.service';
import {CartEntity, CartItemEntity} from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity]), UserModule, ProductModule, RedisxModule],
  controllers: [CartController],
  providers: [CartService, JwtService, JWTService],
  exports: [CartService],
})
export class CartModule {}
