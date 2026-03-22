import type { IntlayerConfig } from 'intlayer';

export const adminLocales = ['en', 'ru', 'it', 'es', 'fr', 'he'] as const;
export const adminDefaultLocale = 'en';

const config: IntlayerConfig = {
  internationalization: {
    locales: [...adminLocales],
    defaultLocale: adminDefaultLocale,
  },
};

export default config;
