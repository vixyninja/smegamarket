import {Module} from '@nestjs/common';
import {AcceptLanguageResolver, I18nModule, QueryResolver} from 'nestjs-i18n';
import {join} from 'path';
import {Environment} from '../configs/environments';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: Environment.FALLBACK_LANGUAGE,
      logging: true,
      loaderOptions: {
        path: join(__dirname, '..', '/i18n/'),
        watch: true,
      },
      // typesOutputPath: join(__dirname, '..', 'i18n', 'i18n.types.ts'),
      resolvers: [{use: QueryResolver, options: ['lang']}, AcceptLanguageResolver],
    }),
  ],
  providers: [],
  exports: [],
})
export class I18nModulex {}
