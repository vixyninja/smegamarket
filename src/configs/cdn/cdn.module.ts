import {Module} from '@nestjs/common';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
  ],
  providers: [],
  controllers: [],
})
export class CdnModule {
  constructor() {
    console.log('CdnModule', join(__dirname, '..', '..', 'public'));
  }
}
