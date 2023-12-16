import {Module} from '@nestjs/common';
import {EventGateway} from './event.gateway';
import {UserModule} from '@/modules';
import {AuthModule} from '@/auth';

@Module({
  imports: [AuthModule, UserModule],
  providers: [EventGateway],
  controllers: [],
  exports: [EventGateway],
})
export class EventModule {}
