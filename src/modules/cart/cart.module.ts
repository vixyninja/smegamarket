import {JWTService, RedisxModule} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {CartController} from './cart.controller';
import {CartService} from './cart.service';
import {CartEntity, CartItemEntity} from './entities';
import {UserModule} from '../user';
import {ProductModule} from '../product';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, CartItemEntity]), UserModule, ProductModule, RedisxModule],
  controllers: [CartController],
  providers: [CartService, JwtService, JWTService],
  exports: [CartService],
})
export class CartModule {}
