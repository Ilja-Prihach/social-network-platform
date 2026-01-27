import { Locales, type IntlayerConfig } from 'intlayer';

const config: IntlayerConfig = {
  internationalization: {
    locales: [
      Locales.ENGLISH,
      Locales.FRENCH,
      Locales.SPANISH,
      Locales.RUSSIAN,
      Locales.ITALIAN,
      Locales.HEBREW,
    ],
    defaultLocale: Locales.ENGLISH,
  },
};

export default config;
