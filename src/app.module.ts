import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {CloudinaryModule, MailModule, PostgresDBService, RedisxModule, ThrottlerxModule} from './configs';
import {UserModule} from './modules/user';
import {AuthModule} from './auth/auth.module';

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
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
