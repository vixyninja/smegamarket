// import {Module} from '@nestjs/common';
// import {MongooseModule} from '@nestjs/mongoose';
// import {MongooseConfigService} from './mongodb.service';

// @Module({
//   imports: [
//     MongooseModule.forRootAsync({
//       useClass: MongooseConfigService,
//       inject: [MongooseConfigService],
//     }),
//   ],
//   providers: [
//     {
//       provide: 'DATABASE_CONNECTION',
//       useClass: MongooseConfigService,
//     },
//   ],
//   exports: [MongooseModule, 'DATABASE_CONNECTION'],
// })
// export class MongodbModule {}
