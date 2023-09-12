import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';

import {MongooseModule} from '@nestjs/mongoose';
import {Logger} from 'src/core';
import {AuthModule} from './auth/auth.module';
import {CloudinaryModule, MailModule, MongooseConfigService} from './configs';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
      inject: [MongooseConfigService],
    }),
    MailModule,
    CloudinaryModule,
    AuthModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Logger).forRoutes('*');
  }
}
