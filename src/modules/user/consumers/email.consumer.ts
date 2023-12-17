import {HttpInternalServerError, IMail} from '@/core';
import {MailerService} from '@nestjs-modules/mailer';
import {Process, Processor} from '@nestjs/bull';
import {Job} from 'bull';

@Processor('email')
export class EmailConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @Process('sendUserConfirmation')
  async sendUserConfirmation(job: Job<IMail>) {
    try {
      const {data} = job;
      const {from, subject, text, to, link, name} = data;

      await this.mailerService.sendMail({
        from: from,
        subject: subject,
        text: text,
        to: to,
        date: new Date(),
        template: 'user-information',
        context: {
          name: name,
          link: link,
        },
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  @Process('sendUserResetPasswordOtp')
  async sendUserResetPasswordOtp(job: Job<IMail>) {
    try {
      const {data} = job;
      const {from, subject, text, to, code, email, name} = data;

      console.log(job);

      await this.mailerService.sendMail({
        from: from,
        subject: subject,
        text: text,
        to: to,
        date: new Date(),
        template: 'reset-password',
        context: {
          code: code,
          name: name,
          email: email,
        },
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  @Process('sendUserResetPasswordSuccess')
  async sendUserResetPasswordSuccess(data: IMail) {
    try {
      const {from, subject, text, to, name, email} = data;
      await this.mailerService.sendMail({
        from: from,
        subject: subject,
        text: text,
        to: to,
        date: new Date(),
        template: 'reset-password-success',
        context: {
          name: name,
          email: email,
        },
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  @Process('sendUserVerifyCode')
  async sendUserVerifyCode(data: IMail) {
    try {
      const {from, subject, text, to, name, information, code} = data;
      await this.mailerService.sendMail({
        from: from,
        subject: subject,
        text: text,
        to: to,
        date: new Date(),
        template: 'verify-code',
        context: {
          name: name,
          information: information,
          code: code,
        },
      });
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
