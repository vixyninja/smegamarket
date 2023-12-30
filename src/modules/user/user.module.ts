import {JWTService, MailModule, RedisxModule} from '@/configs';
import {BullModule} from '@nestjs/bull';
import {Module} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {TypeOrmModule} from '@nestjs/typeorm';
import {join} from 'path';
import {MediaModule} from '../media';
import {EmailConsumer} from './consumers';
import {AdminController, UserController} from './controllers';
import {UserEntity} from './entities';
import {UserRepository} from './repositories';
import {UserMailService, UserService} from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    RedisxModule,
    MediaModule,
    MailModule,
    BullModule.registerQueue(
      {name: 'email', processors: [join(__dirname, 'consumers', 'email.consumer.js')]},
      {name: 'sms'},
      {name: 'notification'},
    ),
  ],
  controllers: [UserController, AdminController],
  providers: [UserRepository, UserService, UserMailService, JwtService, JWTService, EmailConsumer],
  exports: [UserService, UserMailService],
})
export class UserModule {}
