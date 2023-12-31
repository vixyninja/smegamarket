import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AppController} from './app.controller';
import {AuthModule} from './auth';
import {
  CachexModule,
  CdnModule,
  CloudinaryModule,
  FirebaseAdminModule,
  MailModule,
  PostgresDBModule,
  QueuesModule,
  RedisxModule,
  ThrottlerxModule,
} from './configs';
import {LoggerModule, LoggersMiddleware, OriginMiddleware} from './core';
import {EventModule} from './event';
import {MediaModule, UserModule} from './modules';
import {CategoriesModule} from './modules/categories/categories.module';
import {ProductModule} from './modules/product/product.module';
import {ShippingModule} from './modules/shipping/shipping.module';
import {TagModule} from './modules/tag/tag.module';

@Module({
  imports: [
    PostgresDBModule,
    // MongodbModule,
    FirebaseAdminModule,
    EventModule,
    QueuesModule,
    CdnModule,
    MailModule,
    CloudinaryModule,
    RedisxModule,
    CachexModule,
    ThrottlerxModule,
    AuthModule,
    LoggerModule,

    // MODULES
    UserModule,
    MediaModule,
    TagModule,
    CategoriesModule,
    ProductModule,
    ShippingModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggersMiddleware).forRoutes('*');
    consumer.apply(OriginMiddleware).forRoutes('*');
  }
}
