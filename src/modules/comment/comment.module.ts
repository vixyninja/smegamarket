import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Comment, CommentSchema} from 'src/models';
import {CommentController} from './comment.controller';
import {CommentService} from './comment.service';
import {UserModule} from '../user';

@Module({
  imports: [MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]), UserModule],
  controllers: [CommentController],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
