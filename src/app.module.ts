import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {AcceptLanguageResolver, CookieResolver, HeaderResolver, I18nModule, QueryResolver} from 'nestjs-i18n';
import {join} from 'path';
import {AppController} from './app.controller';
import {AuthModule} from './auth';
import {
  CachexModule,
  CdnModule,
  CloudinaryModule,
  Environment,
  FirebaseAdminModule,
  MailModule,
  PostgresDBModule,
  QueuesModule,
  RedisxModule,
  ThrottlerxModule,
} from './configs';
import {LoggerModule, LoggersMiddleware, OriginMiddleware} from './core';
import {EventModule} from './event';
import {BrandModule, CartModule, CategoryModule, MediaModule, OrderModule, ProductModule, UserModule} from './modules';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: Environment.FALLBACK_LANGUAGE,
      logging: true,
      loaderOptions: {
        path: join(__dirname, '/i18n/'),
        watch: true,
      },
      typesOutputPath: join(__dirname, '../src/i18n/generated/i18n.generated.ts'),
      resolvers: [
        {use: QueryResolver, options: ['lang', 'locale', 'l']},
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
        new CookieResolver(['lang', 'locale', 'l']),
      ],
    }),

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
