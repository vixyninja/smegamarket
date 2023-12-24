import {I18nTranslations} from '@/i18n/generated/i18n.generated';
import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';
import {i18nValidationMessage} from 'nestjs-i18n';

export class SignUpEmailDTO {
  @IsEmail({}, {message: i18nValidationMessage<I18nTranslations>('content.auth.email.notValid')})
  @IsNotEmpty({message: i18nValidationMessage<I18nTranslations>('content.auth.email.required')})
  readonly email: string;

  @IsNotEmpty({message: i18nValidationMessage<I18nTranslations>('content.auth.password.required')})
  @MinLength(6, {
    message: i18nValidationMessage<I18nTranslations>('content.auth.password.minLength'),
  })
  readonly password: string;

  @IsNotEmpty({message: i18nValidationMessage<I18nTranslations>('content.auth.confirmPassword.required')})
  @MinLength(6, {
    message: i18nValidationMessage<I18nTranslations>('content.auth.confirmPassword.minLength'),
  })
  readonly confirmPassword: string;

  @IsNotEmpty({message: i18nValidationMessage<I18nTranslations>('content.auth.deviceToken.required')})
  readonly deviceToken: string;

  @IsNotEmpty({message: i18nValidationMessage<I18nTranslations>('content.auth.deviceType.required')})
  readonly deviceType: string;

  @IsNotEmpty({message: i18nValidationMessage<I18nTranslations>('content.auth.firstName.required')})
  readonly firstName: string;

  @IsNotEmpty({message: i18nValidationMessage<I18nTranslations>('content.auth.lastName.required')})
  readonly lastName: string;
}
