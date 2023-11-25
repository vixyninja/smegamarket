import {JWTService, RedisxModule} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserController} from './user.controller';
import {UserEntity} from './entities';
import {UserService} from './user.service';
import {FileModule} from '../file';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RedisxModule, FileModule],
  controllers: [UserController],
  providers: [UserService, JwtService, JWTService],
  exports: [UserService],
})
export class UserModule {}
