import {Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import {ThrottlerStorageRedisService} from 'nestjs-throttler-storage-redis';
import {REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME, THROTTLE_LIMIT, THROTTLE_TTL} from '../environments';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            ttl: THROTTLE_TTL,
            limit: THROTTLE_LIMIT,
          },
        ],
        storage: new ThrottlerStorageRedisService({
          host: REDIS_HOST,
          port: REDIS_PORT,
          username: REDIS_USERNAME,
          password: REDIS_PASSWORD,
        }),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class ThrottlerxModule {}
