import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {MongooseProvider} from './mongodb.provider';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseProvider,
      inject: [MongooseProvider],
    }),
  ],
  providers: [
    {
      provide: 'MONGO_PROVIDER',
      useClass: MongooseProvider,
    },
  ],
  exports: [MongooseModule, 'MONGO_PROVIDER'],
})
export class MongodbModule {}
