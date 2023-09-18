import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';

import {HttpModule} from '@nestjs/axios';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {FireBaseModule} from './firebase/firebase.module';
import {UserModule} from 'src/modules/user/user.module';

@Module({
  imports: [
    FireBaseModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
