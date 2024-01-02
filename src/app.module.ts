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
import {MediaModule, TagModule, UserModule} from './modules';
import {CategoriesModule} from './modules/categories/categories.module';
import {ProductModule} from './modules/product/product.module';
import {ShippingModule} from './modules/shipping/shipping.module';
import {CouponModule} from './modules/coupon/coupon.module';
import {CartModule} from './modules/cart/cart.module';
import {OrderModule} from './modules/order/order.module';
import {SettingModule} from './modules/setting/setting.module';
import {SlideshowModule} from './modules/slideshow/slideshow.module';
import {RoleModule} from './modules/role/role.module';
import {StaffModule} from './modules/staff/staff.module';

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
    CouponModule,
    CartModule,
    OrderModule,
    SettingModule,
    SlideshowModule,
    RoleModule,
    StaffModule,
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
