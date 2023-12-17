import {BullModule} from '@nestjs/bull';
import {Global, Module} from '@nestjs/common';
import {QueuesProvider} from './queues.provider';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useClass: QueuesProvider,
      inject: [QueuesProvider],
    }),
  ],
  providers: [QueuesProvider],
  exports: [QueuesProvider],
})
export class QueuesModule {}
