import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';

import {Logger} from 'src/core';
import {AuthModule} from './auth/auth.module';
import {CloudinaryModule, MailModule, MongodbModule, RedisxModule, ThrottlerxModule} from './configs';
import {UserModule} from './modules/user';
import {LinkModule} from './modules/link';
import {CommentModule} from './modules/comment';
import {ReviewModule} from './modules/review';
import {CourseModule} from './modules/course';

@Module({
  imports: [
    MailModule,
    CloudinaryModule,
    AuthModule,
    MongodbModule,
    UserModule,
    RedisxModule,
    ThrottlerxModule,
    LinkModule,
    CommentModule,
    ReviewModule,
    CourseModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Logger).forRoutes('*');
  }
}
