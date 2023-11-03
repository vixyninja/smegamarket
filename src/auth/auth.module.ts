import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {JWTService, MailModule, RedisxModule} from '@/configs';
import {JwtService} from '@nestjs/jwt';
import {UserEntity, UserModule} from '@/modules/user';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule, TypeOrmModule, RedisxModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, JWTService, JwtService],
  exports: [AuthService, JWTService, JwtService],
})
export class AuthModule {}
