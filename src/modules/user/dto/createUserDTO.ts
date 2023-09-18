import {IsNotEmpty} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  firebase_uid: string;

  constructor(name: string, email: string, hashPassword: string, firebase_uid: string) {
    this.name = name;
    this.email = email;
    this.firebase_uid = firebase_uid;
  }
}
