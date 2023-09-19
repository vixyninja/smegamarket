import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {Module} from '@nestjs/common';
import {join} from 'path';
import {MAIL_HOST, MAIL_PASSWORD, MAIL_USER} from '../environments';
import {MailService} from './mail.service';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: MAIL_HOST,
          port: 587,
          date: new Date(),
          secure: false,
          auth: {
            user: MAIL_USER,
            pass: MAIL_PASSWORD,
          },
        },
        defaults: {
          from: '"No Reply" <noreply@lms.com.vn>',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
