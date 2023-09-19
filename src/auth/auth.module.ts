import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

import {HttpModule} from '@nestjs/axios';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {FireBaseModule} from './firebase/firebase.module';
import {UserModule} from 'src/modules/user/user.module';
import {MailModule} from 'src/configs';
import {RedisxModule} from 'src/configs/redisx/redisx.module';

@Module({
  imports: [
    FireBaseModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    UserModule,
    MailModule,
    RedisxModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
