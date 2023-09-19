import {RedisModuleOptions, RedisModuleOptionsFactory} from '@nestjs-modules/ioredis';
import {Injectable} from '@nestjs/common';
import {REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME} from '../environments';

@Injectable()
export class RedisxConfigService implements RedisModuleOptionsFactory {
  createRedisModuleOptions(): RedisModuleOptions | Promise<RedisModuleOptions> {
    return {
      config: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD,
      },
      catch(onrejected) {
        throw new Error('Method not implemented. ' + onrejected.toString());
      },
    };
  }
}
