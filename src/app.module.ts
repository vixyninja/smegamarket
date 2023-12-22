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
import {I18nModulex} from './i18n';
import {BrandModule, CartModule, CategoryModule, MediaModule, OrderModule, ProductModule, UserModule} from './modules';

@Module({
  imports: [
    PostgresDBModule,
    // MongodbModule,
    FirebaseAdminModule,
    I18nModulex,
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
    BrandModule,
    ProductModule,
    CategoryModule,
    CartModule,
    OrderModule,
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
