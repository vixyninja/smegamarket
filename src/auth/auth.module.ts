import {JWTService, MailModule, RedisxModule} from '@/configs';
import {UserModule} from '@/modules/user';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthController} from './controllers';
import {AuthService} from './services';

@Module({
  imports: [UserModule, TypeOrmModule, RedisxModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, JWTService, JwtService],
  exports: [AuthService, JWTService, JwtService],
})
export class AuthModule {}
