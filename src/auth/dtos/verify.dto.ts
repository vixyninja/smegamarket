import {IsEmail, IsNotEmpty, IsPhoneNumber, Length} from 'class-validator';

export class VerifyPhoneDTO {
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  readonly phone: string;
}

export class VerifyEmailDTO {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}

export class VerifyOtpDTO {
  @IsNotEmpty()
  readonly information: string;

  @IsNotEmpty()
  @Length(6, 6)
  readonly otp: string;
}
