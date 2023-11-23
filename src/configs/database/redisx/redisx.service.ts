import {Injectable} from '@nestjs/common';
import {InjectRedis, Redis} from '@nestjs-modules/ioredis';
import {CACHE_TTL} from '@/core';

@Injectable()
export class RedisxService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setKey(key: string, value: string, expire?: number) {
    return await this.redis.set(key, value, 'EX', expire || CACHE_TTL);
  }

  async getKey(key: string) {
    return await this.redis.get(key);
  }

  async delKey(key: string) {
    return await this.redis.del(key);
  }

  async keys(pattern: string) {
    return await this.redis.keys(pattern);
  }

  async flushall() {
    return await this.redis.flushall();
  }

  async flushdb() {
    return await this.redis.flushdb();
  }

  async getMemory() {
    return await this.redis.info('memory');
  }

  async getStats() {
    return await this.redis.info('stats');
  }
}
