import {MailerModule} from '@nestjs-modules/mailer';
import {PugAdapter} from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import {Module} from '@nestjs/common';

import {MailService} from './mail.service';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          date: new Date(),
          secure: false,
          auth: {
            user: 'nevergiveup2k3@gmail.com',
            pass: 'ymsflakmmvaaeess',
          },
        },
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
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
