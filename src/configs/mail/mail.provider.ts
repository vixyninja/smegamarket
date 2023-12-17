import {MailerOptions, MailerOptionsFactory} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {Injectable} from '@nestjs/common';
import {join} from 'path';
import {Environment} from '../environments';

@Injectable()
export class MailProvider implements MailerOptionsFactory {
  createMailerOptions(): MailerOptions | Promise<MailerOptions> {
    return {
      transport: {
        host: Environment.MAIL_HOST,
        port: 587,
        date: new Date(),
        secure: false,
        auth: {
          user: Environment.MAIL_USER,
          pass: Environment.MAIL_PASSWORD,
        },
      },
      template: {
        dir: join(__dirname, 'template'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
