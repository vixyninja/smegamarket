import {RedisModule} from '@nestjs-modules/ioredis';

import {Module, OnModuleInit} from '@nestjs/common';
import {RedisxConfigService} from './redisx.provider';
import {RedisxService} from './redisx.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: RedisxConfigService,
      inject: [RedisxConfigService],
    }),
  ],
  providers: [
    {
      provide: 'REDIS_CONNECTION',
      useClass: RedisxConfigService,
    },
    RedisxService,
  ],
  exports: [RedisModule, RedisxService, 'REDIS_CONNECTION'],
})
export class RedisxModule {}
