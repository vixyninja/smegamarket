import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AuthModule} from './auth';
import {
  CachexModule,
  CdnModule,
  CloudinaryModule,
  MailModule,
  PostgresDBModule,
  RedisxModule,
  ThrottlerxModule,
} from './configs';
import {LoggerModule} from './core';
import {EventModule} from './event';
import {BrandModule, CartModule, CategoryModule, MediaModule, OrderModule, ProductModule, UserModule} from './modules';

@Module({
  imports: [
    PostgresDBModule,
    // MongodbModule,
    EventModule,
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
export class AppModule {}
