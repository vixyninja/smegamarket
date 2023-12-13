import {Injectable} from '@nestjs/common';
import {InjectRedis, Redis} from '@nestjs-modules/ioredis';
import {CACHE_KEY_TTL} from '@/core';

@Injectable()
export class RedisxService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setKey(key: string, value: string, expire?: number) {
    return await this.redis.set(key, value, 'EX', expire || CACHE_KEY_TTL.ONE_HOUR);
  }

  async getKey(key: string) {
    return await this.redis.get(key);
  }

  async delKey(key: string) {
    return await this.redis.del(key);
  }

  async wrap(key: string, callback: () => Promise<any>, expire?: number): Promise<any> {
    const value = await this.getKey(key);
    if (value) {
      return value;
    }
    const result = await callback();
    await this.setKey(key, result, expire);
    return result;
  }

  async forceWrap(key: string, callback: () => Promise<any>, expire?: number): Promise<any> {
    const result = await callback();
    await this.setKey(key, result, expire);
    return result;
  }
}
