// import {Module} from '@nestjs/common';
// import {JwtService} from '@nestjs/jwt';

// import {HttpModule} from '@nestjs/axios';
// import {AuthController} from './auth.controller';
// import {AuthService} from './auth.service';
// import {MailModule, RedisxModule} from 'src/configs';
// import {FireBaseModule} from './firebase';

// @Module({
//   imports: [
//     FireBaseModule,
//     HttpModule.register({
//       timeout: 5000,
//       maxRedirects: 5,
//     }),
//     MailModule,
//     RedisxModule,
//   ],
//   controllers: [AuthController],
//   providers: [AuthService, JwtService],
// })
// export class AuthModule {}
