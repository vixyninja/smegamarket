import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';

import {HttpInternalServerError} from 'src/core';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string) {
    const url = `https://www.facebook.com/vy.huynhhong.90`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Create account successfully',
        from: 'noreply@nestjs.com',
        text: 'Hello',
        html: `<b>Welcome to my channel ${url}</b>`,
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
