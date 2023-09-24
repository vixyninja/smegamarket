import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {User} from './user.model';

export type CommentDocument = Comment & Document;

@Schema({timestamps: true, id: true})
export class Comment {
  @Prop({name: 'owner', type: Types.ObjectId, ref: User.name})
  owner: User;

  @Prop({name: 'comment', type: String, default: ''})
  comment: string;

  @Prop({name: 'like', type: [Types.ObjectId], ref: User.name, default: []})
  like: [User];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
