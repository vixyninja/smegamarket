import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';
import {GROUP_EMAIL, HttpInternalServerError} from 'src/core';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        from: GROUP_EMAIL,
        to: email,
        subject: `Hello ${name}. Welcome to Mega Market!`,
        template: './user-information',
        context: {
          name: email,
        },
        date: new Date(),
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async sendUserResetPasswordOtp(name: string, email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        from: GROUP_EMAIL,
        to: email,
        subject: 'Reset password code for Mega Market',
        template: './reset-password',
        context: {
          name,
          email,
          code,
        },
        date: new Date(),
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async sendUserResetPasswordSuccess(name: string, email: string) {
    try {
      await this.mailerService.sendMail({
        from: GROUP_EMAIL,
        to: email,
        subject: 'Reset password successfully',
        template: './reset-password-success',
        context: {
          name,
          email,
        },
        date: new Date(),
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async sendUserVerifyCode(name: string, information: string, code: string) {
    try {
      await this.mailerService.sendMail({
        from: GROUP_EMAIL,
        to: information,
        subject: 'Verify code for Mega Market',
        template: './verify-code',
        context: {
          name,
          information,
          code,
        },
        date: new Date(),
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
