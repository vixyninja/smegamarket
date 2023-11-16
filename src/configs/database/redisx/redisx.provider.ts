import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';
import {Injectable} from '@nestjs/common';
import {Environment} from '@/configs/environments';

@Injectable()
export class RedisxConfigService implements RedisModuleOptionsFactory {
  createRedisModuleOptions(): RedisModuleOptions | Promise<RedisModuleOptions> {
    return {
      config: {
        host: Environment.REDIS_HOST,
        port: Environment.REDIS_PORT,
        username: Environment.REDIS_USERNAME,
        password: Environment.REDIS_PASSWORD,
      },
      catch(onrejected) {
        throw new Error('Method not implemented. ' + onrejected.toString());
      },
    };
  }
}
