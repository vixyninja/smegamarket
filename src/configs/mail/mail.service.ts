import {MailerService} from '@nestjs-modules/mailer';
import {Injectable} from '@nestjs/common';

import {HttpInternalServerError} from 'src/core';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmation(email: string, name: string) {
    const url = `https://www.facebook.com/vy.huynhhong.90`;
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `Hello ${name}. Welcome to Nice App!`,
        template: './confirmation',
        context: {
          name: email,
          url,
        },
        date: new Date(),
      });
    } catch (e) {
      console.log(e);
      throw new HttpInternalServerError(e.message);
    }
  }
}
