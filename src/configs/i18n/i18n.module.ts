import {Module} from '@nestjs/common';
import {AcceptLanguageResolver, I18nModule, QueryResolver} from 'nestjs-i18n';
import {join} from 'path';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'vi',
        loaderOptions: {
          path: join(__dirname, '..', 'i18n'),
          watch: true,
        },
        typesOutputPath: join(__dirname, '..', 'i18n', 'i18n.types.ts'),
      }),
      resolvers: [{use: QueryResolver, options: ['lang']}, AcceptLanguageResolver],
      logging: true,
    }),
  ],
  providers: [],
  exports: [],
})
export class I18nModulex {
  constructor() {
    console.log('Environment', join(__dirname, '..', 'i18n'));
  }
}
