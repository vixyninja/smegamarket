import {BullRootModuleOptions, SharedBullConfigurationFactory} from '@nestjs/bull';
import {Injectable} from '@nestjs/common';
import {Environment} from '../environments';

@Injectable()
export class QueuesProvider implements SharedBullConfigurationFactory {
  createSharedConfiguration(): BullRootModuleOptions | Promise<BullRootModuleOptions> {
    return {
      redis: {
        host: Environment.REDIS_HOST,
        port: Environment.REDIS_PORT,
      },
      prefix: 'queue', // prefix for all queues
      defaultJobOptions: {
        removeOnComplete: false,
        removeOnFail: false,
      },
    };
  }
}
