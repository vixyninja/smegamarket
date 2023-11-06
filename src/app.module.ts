import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AuthModule} from './auth/auth.module';
import {CloudinaryModule, MailModule, PostgresDBService, RedisxModule, ThrottlerxModule} from './configs';
import {FileModule, UserModule} from './modules';

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
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
