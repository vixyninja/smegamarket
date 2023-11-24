import {Module} from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import {ThrottlerStorageRedisService} from 'nestjs-throttler-storage-redis';
import {Environment} from '@/configs/environments';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        throttlers: [
          {
            ttl: Environment.THROTTLE_TTL,
            limit: Environment.THROTTLE_LIMIT,
          },
        ],
        storage: new ThrottlerStorageRedisService({
          host: Environment.REDIS_HOST,
          port: Environment.REDIS_PORT,
          keyPrefix: 'throttler:',
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
