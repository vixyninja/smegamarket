import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {User} from './user.model';
import {Comment} from './comment.model';

export type ReviewDocument = Review & Document;

@Schema({timestamps: true, id: true})
export class Review {
  @Prop({required: true, ref: User.name, type: Types.ObjectId, name: 'user'})
  user: User;

  @Prop({name: 'rating', type: Number, required: true, default: 0})
  rating: number;

  @Prop({name: 'comment', type: [Types.ObjectId], ref: Comment.name, default: []})
  comment: [Comment];

  @Prop({name: 'commentReply', type: [Types.ObjectId], ref: Comment.name, default: []})
  commentReply: [Comment];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
