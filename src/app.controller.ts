import {Controller, Get} from '@nestjs/common';
import {I18n, I18nContext} from 'nestjs-i18n';
import {PublicRoute} from './core';
import {I18nTranslations} from './i18n/generated/i18n.generated';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @PublicRoute(true)
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
}
