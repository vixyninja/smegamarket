import {JWTService, MailModule, RedisxModule} from '@/configs';
import {BullModule} from '@nestjs/bull';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {join} from 'path';
import {MediaModule} from '../media';
import {AdminController, UserController} from './controllers';
import {UserEntity} from './entities';
import {UserMailService, UserService} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RedisxModule,
    MediaModule,
    MailModule,
    BullModule.registerQueue(
      {name: 'email', processors: [join(__dirname, 'consumers', 'email.consumer.ts')]},
      {name: 'sms'},
      {name: 'notification'},
    ),
  ],
  controllers: [UserController, AdminController],
  providers: [UserService, UserMailService, JwtService, JWTService],
  exports: [UserService, UserMailService],
})
export class UserModule {}
