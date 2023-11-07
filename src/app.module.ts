import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {CloudinaryModule, MailModule, PostgresDBService, RedisxModule, ThrottlerxModule} from './configs';
import {FileModule, UserModule} from './modules';
import { CategoryModule } from './modules/category/category.module';
import { ProductCategoryModule } from './modules/product_category/product_category.module';
import { BrandModule } from './modules/brand/brand.module';
import { ProductUploadModule } from './modules/product_upload/product_upload.module';
import { ProductModule } from './modules/product/product.module';

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

    // MODULES
    UserModule,
    FileModule,
    CategoryModule,
    ProductCategoryModule,
    BrandModule,
    ProductUploadModule,
    ProductModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
