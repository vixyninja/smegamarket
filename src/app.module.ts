import {Module} from '@nestjs/common';

import {AppController} from './app.controller';
import {CloudinaryModule, MailModule, RedisxModule, ThrottlerxModule} from './configs';
import {PostgresDBModule} from './configs/postgresdb';

@Module({
  imports: [MailModule, CloudinaryModule, RedisxModule, PostgresDBModule, ThrottlerxModule],
  providers: [],
  controllers: [AppController],
})
export class AppModule {}
