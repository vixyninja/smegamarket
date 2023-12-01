import {JWTService, RedisxModule} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MediaModule} from '../media';
import {UserEntity} from './entities';
import {UserController} from './user.controller';
import {UserService} from './user.service';
import {AdminController} from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RedisxModule, MediaModule],
  controllers: [UserController, AdminController],
  providers: [UserService, JwtService, JWTService],
  exports: [UserService],
})
export class UserModule {}
