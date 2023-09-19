import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';

import {Logger} from 'src/core';
import {AuthModule} from './auth/auth.module';
import {CloudinaryModule, MailModule, MongodbModule, RedisxModule, ThrottlerxModule} from './configs';
import {UserModule} from './modules/user';

@Module({
  imports: [MailModule, CloudinaryModule, AuthModule, MongodbModule, UserModule, RedisxModule, ThrottlerxModule],
  providers: [],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Logger).forRoutes('*');
  }
}
