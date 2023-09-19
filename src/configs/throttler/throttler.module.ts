import {MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import {THROTTLE_TTL, THROTTLE_LIMIT, REDIS_HOST, REDIS_USERNAME, REDIS_PORT, REDIS_PASSWORD} from '../environments';
import {ThrottlerStorageRedisService} from 'nestjs-throttler-storage-redis';

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
