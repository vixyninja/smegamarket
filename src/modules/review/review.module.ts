import {Module} from '@nestjs/common';
import {ReviewService} from './review.service';
import {ReviewController} from './review.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {Review, ReviewSchema} from 'src/models';
import {UserModule} from '../user';
import {CommentModule} from '../comment';

@Module({
  imports: [MongooseModule.forFeature([{name: Review.name, schema: ReviewSchema}]), UserModule, CommentModule],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
