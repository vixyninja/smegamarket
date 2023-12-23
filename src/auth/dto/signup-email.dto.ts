import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';
import {i18nValidationMessage} from 'nestjs-i18n';

export class SignUpEmailDTO {
  @IsEmail({}, {message: i18nValidationMessage('content.auth.email.notValid')})
  @IsNotEmpty({message: i18nValidationMessage('content.auth.email.required')})
  readonly email: string;

  @IsNotEmpty({message: i18nValidationMessage('content.auth.password.required')})
  @MinLength(6, {
    message: i18nValidationMessage('content.auth.password.minlength'),
  })
  readonly password: string;

  @IsNotEmpty({message: i18nValidationMessage('content.auth.confirmPassword.required')})
  @MinLength(6, {
    message: i18nValidationMessage('content.auth.confirmPassword.minlength'),
  })
  readonly confirmPassword: string;

  @IsNotEmpty({message: i18nValidationMessage('content.auth.deviceToken.required')})
  readonly deviceToken: string;

  @IsNotEmpty({message: i18nValidationMessage('content.auth.deviceType.required')})
  readonly deviceType: string;

  @IsNotEmpty({message: i18nValidationMessage('content.auth.firstName.required')})
  readonly firstName: string;

  @IsNotEmpty({message: i18nValidationMessage('content.auth.lastName.required')})
  readonly lastName: string;
}
