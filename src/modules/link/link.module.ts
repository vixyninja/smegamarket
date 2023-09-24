import {Module} from '@nestjs/common';
import {LinkService} from './link.service';
import {LinkController} from './link.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {Link, LinkSchema} from 'src/models';
import {UserModule} from '../user';

@Module({
  imports: [MongooseModule.forFeature([{name: Link.name, schema: LinkSchema}]), UserModule],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
