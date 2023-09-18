import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({timestamps: true, id: true})
export class User {
  @Prop({required: true, trim: true, name: 'name', type: String})
  name: string;

  @Prop({required: true, trim: true, unique: true, name: 'email', type: String})
  email: string;

  @Prop({required: true, trim: true, name: 'hashPassword', type: String, select: false})
  hashPassword: string;

  @Prop({name: 'salt', type: String, select: false})
  salt: string;

  @Prop({name: 'avatar', type: Object})
  avatar: {
    public_id: string;
    url: string;
  };

  @Prop({name: 'role', type: String, default: 'user'})
  role: string;

  @Prop({name: 'isVerified', type: Boolean, default: false})
  isVerified: boolean;

  @Prop({name: 'courses', type: Array, default: []})
  courses: Array<{course: string; progress: number}>;

  constructor(
    name: string,
    email: string,
    hashPassword: string,
    salt: string,
    avatar: {public_id: string; url: string},
    role: string,
    isVerified: boolean,
    courses: Array<{course: string; progress: number}>,
  ) {
    this.name = name;
    this.email = email;
    this.hashPassword = hashPassword;
    this.salt = salt;
    this.avatar = avatar;
    this.role = role;
    this.isVerified = isVerified;
    this.courses = courses;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = bcrypt.genSaltSync(10);
    this.salt = salt;
    const hashPassword = bcrypt.hashSync(this.hashPassword, salt);
    this.hashPassword = hashPassword;
    return next();
  } catch (e) {
    return next(e);
  }
});

UserSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compareSync(password, this.hashPassword);
};
