import {CacheInterceptor, CacheModule} from '@nestjs/cache-manager';
import {Module} from '@nestjs/common';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {CachexService} from './cache.service';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60,
      max: 100,
      isGlobal: true,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    CachexService,
  ],
})
export class CachexModule {
  constructor() {}
}
