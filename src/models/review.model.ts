import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {User} from './user.model';
import {Comment} from './comment.model';

export type ReviewDocument = Review & Document;

@Schema({timestamps: true, id: true})
export class Review {
  @Prop({
    required: true,
    ref: User.name,
    type: Types.ObjectId,
    name: 'user',
  })
  user: User;

  @Prop({required: true, trim: true, name: 'rating', type: Number})
  rating: number;

  @Prop({required: true, trim: true, name: 'comment', type: [Types.ObjectId], ref: Comment.name})
  comment: [Comment];

  @Prop({required: true, trim: true, name: 'commentReply', type: [Types.ObjectId], ref: Comment.name})
  commentReply: [Comment];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
