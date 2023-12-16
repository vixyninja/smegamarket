import {JWTService, RedisxModule} from '@/configs';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {MediaModule} from '../media';
import {AdminController, UserController} from './controllers';
import {UserEntity} from './entities';
import {UserService} from './services';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RedisxModule, MediaModule],
  controllers: [UserController, AdminController],
  providers: [UserService, JwtService, JWTService],
  exports: [UserService],
})
export class UserModule {}
