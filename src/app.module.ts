import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';

import {Logger} from 'src/core';
import {AuthModule} from './auth/auth.module';
import {CloudinaryModule, MailModule, MongodbModule} from './configs';
import {UserModule} from './modules/user/user.module';
import {RedisxModule} from './configs/redisx/redisx.module';

@Module({
  imports: [MailModule, CloudinaryModule, AuthModule, MongodbModule, UserModule, RedisxModule],
  providers: [],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Logger).forRoutes('*');
  }
}
