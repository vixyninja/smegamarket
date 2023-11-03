import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';

import {HttpInternalServerError} from 'src/core';

const GROUP_EMAIL = 'hhvy2003.dev@gmail.com';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: GROUP_EMAIL,
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

  async sendUserResetPassword(name: string, email: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: GROUP_EMAIL,
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
}
