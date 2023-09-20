import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {User} from './user.model';

export type CommentDocument = Comment & Document;

@Schema({timestamps: true, id: true})
export class Comment {
  @Prop({required: true, trim: true, name: 'comment', type: String, default: ''})
  comment: string;

  @Prop({required: true, trim: true, name: 'like', type: [Types.ObjectId], ref: User.name, default: []})
  like: [User];

  @Prop({required: true, trim: true, name: 'owner', type: Types.ObjectId, ref: User.name})
  owner: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
