import {Controller, Get} from '@nestjs/common';
import {I18n, I18nContext} from 'nestjs-i18n';
import {I18nTranslations} from './configs';
import {Public} from './core';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Public()
  async getHello(@I18n() i18n: I18nContext<I18nTranslations>) {
    let foo = await i18n.t('Foo');

    return {
      data: {
        timestamp: new Date().toISOString(),
        version: '0.0.1',
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        host: process.env.HOST,
        language: i18n.lang.toString(),
        foo: foo,
      },
    };
  }
}
