const { resolve } = require('path');

const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en';

const config = {
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [DEFAULT_LOCALE],
  },
  fallbackLng: {
    default: [DEFAULT_LOCALE],
  },
  localePath: resolve('./public/locales'),
};

module.exports = config;
