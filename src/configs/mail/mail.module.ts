import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {Module} from '@nestjs/common';
import {join} from 'path';
import {MailService} from './mail.service';
import {Environment} from '../environments';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
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
