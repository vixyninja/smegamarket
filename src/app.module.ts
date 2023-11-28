import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {CloudinaryModule, MailModule, PostgresDBService, RedisxModule, ThrottlerxModule} from './configs';
import {LoggerModule} from './core';
import {BrandModule, CartModule, CategoryModule, MediaModule, OrderModule, ProductModule, UserModule} from './modules';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresDBService,
    }),
    MailModule,
    CloudinaryModule,
    RedisxModule,
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
