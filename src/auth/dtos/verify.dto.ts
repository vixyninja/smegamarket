import {IsEmail, IsNotEmpty, IsPhoneNumber, Length} from 'class-validator';

export class VerifyPhoneDTO {
  @IsNotEmpty({message: 'Your phone is required!'})
  @IsPhoneNumber('VN')
  readonly phone: string;
}

export class VerifyEmailDTO {
  @IsNotEmpty({message: 'Your email is required!'})
  @IsEmail({}, {message: 'Your email is invalid, please check again!'})
  readonly email: string;
}

export class VerifyOtpDTO {
  @IsNotEmpty({message: "This field can't be empty! (Email or Phone)"})
  readonly information: string;

  @IsNotEmpty({message: 'Your OTP is required!'})
  @Length(6, 6, {message: 'Your OTP must be 6 characters!'})
  readonly otp: number;
}
