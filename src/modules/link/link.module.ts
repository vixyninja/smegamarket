import {Module} from '@nestjs/common';
import {LinkService} from './link.service';
import {LinkController} from './link.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {Link, LinkSchema} from 'src/models';

@Module({
  imports: [MongooseModule.forFeature([{name: Link.name, schema: LinkSchema}])],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [LinkService],
})
export class LinkModule {}
