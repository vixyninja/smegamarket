import {MailerModule} from '@nestjs-modules/mailer';
import {Module} from '@nestjs/common';
import {MailProvider} from './mail.provider';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailProvider,
      inject: [MailProvider],
    }),
  ],
  providers: [],
  exports: [],
})
export class MailModule {}
