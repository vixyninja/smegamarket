import {JWTService, MailModule, RedisxModule} from '@/configs';
import {I18nModulex} from '@/i18n';
import {UserEntity, UserModule} from '@/modules/user';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthController} from './controllers';
import {AuthService} from './services';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule, TypeOrmModule, RedisxModule, MailModule, I18nModulex],
  controllers: [AuthController],
  providers: [AuthService, JWTService, JwtService],
  exports: [AuthService, JWTService, JwtService],
})
export class AuthModule {}
