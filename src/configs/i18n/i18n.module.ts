import {Module} from '@nestjs/common';
import {AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver} from 'nestjs-i18n';
import {join} from 'path';
import {Environment} from '../environments';

@Module({
  imports: [
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: Environment.FALLBACK_LANGUAGE,
        loaderOptions: {
          path: join(__dirname, '..', 'i18n'),
          watch: true,
        },
        typesOutputPath: join(__dirname, '..', 'i18n', 'i18n.types.ts'),
      }),
      resolvers: [{use: QueryResolver, options: ['lang']}, AcceptLanguageResolver, new HeaderResolver(['x-lang'])],
      logging: true,
    }),
  ],
  providers: [],
  exports: [],
})
export class I18nModulex {}
