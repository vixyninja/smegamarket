import {IsNotEmpty} from 'class-validator';

export class SignInGoogleDTO {
  @IsNotEmpty({message: 'idToken is required'})
  readonly idToken: string;

  @IsNotEmpty({message: 'deviceToken is required'})
  readonly deviceToken: string;
}
