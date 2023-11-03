import {JWTService, RedisxModule} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserController} from './user.controller';
import {UserEntity} from './user.entity';
import {UserService} from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RedisxModule],
  controllers: [UserController],
  providers: [UserService, JwtService, JWTService],
  exports: [UserService],
})
export class UserModule {}
