import {Controller, Get} from '@nestjs/common';
import {I18n, I18nContext} from 'nestjs-i18n';
import {Public} from './core';
import {I18nTranslations} from './i18n/generated/i18n.generated';
import {UserMailService} from './modules';

@Controller()
export class AppController {
  constructor(private readonly UserMailService: UserMailService) {}

  @Get()
  @Public()
  getHello(@I18n() i18n: I18nContext<I18nTranslations>) {
    return {
      data: {
        timestamp: new Date().toISOString(),
        version: '0.0.1',
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        host: process.env.HOST,
        i18n: i18n.lang,
      },
    };
  }

  @Get('ping')
  @Public()
  async ping() {
    return await this.UserMailService.ping();
  }
}
