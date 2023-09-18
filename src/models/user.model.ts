import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({timestamps: true, id: true})
export class User {
  @Prop({name: 'firebase_uid', type: String, required: true, trim: true})
  firebase_uid: string;

  @Prop({required: true, trim: true, name: 'name', type: String})
  name: string;

  @Prop({required: true, trim: true, unique: true, name: 'email', type: String})
  email: string;

  @Prop({name: 'salt', type: String, select: false})
  salt: string;

  @Prop({
    name: 'avatar',
    type: Object,
    default: {
      public_id: 'EMPTY-USER-AVATAR',
      url: 'https://res.cloudinary.com/dhwzs1m4l/image/upload/v1687458348/avatar-empty.png',
    },
  })
  avatar: {
    public_id: string;
    url: string;
  };

  @Prop({name: 'role', type: String, default: 'user', enum: ['user', 'admin']})
  role: string;

  @Prop({name: 'courses', type: Array, default: []})
  courses: Array<{course: string; progress: number}>;

  constructor(
    name: string,
    email: string,
    salt: string,
    avatar: {public_id: string; url: string},
    role: string,
    courses: Array<{course: string; progress: number}>,
  ) {
    this.name = name;
    this.email = email;
    this.salt = salt;
    this.avatar = avatar;
    this.role = role;
    this.courses = courses;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
