import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {CloudinaryModule, MailModule, RedisxModule, ThrottlerxModule} from './configs';
import {UserModule} from './modules/user';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PostgresDBService} from './configs/postgresdb';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresDBService,
    }),
    MailModule,
    CloudinaryModule,
    RedisxModule,
    ThrottlerxModule,
    UserModule,
  ],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
