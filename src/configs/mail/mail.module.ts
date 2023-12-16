import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {Module} from '@nestjs/common';
import {join} from 'path';
import {Environment} from '../environments';
import {MailService} from './mail.service';
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
          dir: join(__dirname, 'template'),
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
