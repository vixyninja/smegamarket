import {CACHE_KEY_TTL} from '@/core';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import {Inject, Injectable} from '@nestjs/common';
import {Cache} from 'cache-manager';

@Injectable()
export class CachexService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<any> {
    return await this.cacheManager.set(key, value, ttl || CACHE_KEY_TTL.ONE_MINUTE);
  }

  async del(key: string): Promise<any> {
    return await this.cacheManager.del(key);
  }

  async reset(): Promise<any> {
    return await this.cacheManager.reset();
  }

  async wrap(key: string, callback: () => Promise<any>, ttl?: number): Promise<any> {
    const value = await this.get(key);
    if (value) {
      return value;
    }
    const result = await callback();
    await this.set(key, result, ttl);
    return result;
  }

  async forceWrap(key: string, callback: () => Promise<any>, ttl?: number): Promise<any> {
    const result = await callback();
    await this.set(key, result, ttl);
    return result;
  }

  async getAllKeyValues(): Promise<any> {
    const keys = await this.cacheManager.store.keys();

    const values = await Promise.all(keys.map((key) => this.get(key)));

    return keys.reduce((acc, key, index) => {
      acc[key] = values[index];
      return acc;
    }, {});
  }
}
