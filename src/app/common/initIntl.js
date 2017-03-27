import { addLocaleData } from 'react-intl';
import areIntlLocalesSupported from 'intl-locales-supported';

// Add other language supports here
const LANGUAGE_SUPPORTS = ['en'];

const loadLocaleData = async () => {
  // only static path could let webpack dynamic import
  await import('intl/locale-data/json/en.json').then(addLocaleData);
};

export default async () => {
  if (global.Intl) {
    // Determine if the built-in `Intl` has the locale data we need.
    if (!areIntlLocalesSupported(LANGUAGE_SUPPORTS)) {
      // `Intl` exists, but it doesn't have the data we need, so load the
      // polyfill and replace the constructors with need with the polyfill's.
      const IntlPolyfill = require('intl'); // eslint-disable-line
      await loadLocaleData();
      Intl.NumberFormat = IntlPolyfill.NumberFormat;
      Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
    }
  } else {
    // No `Intl`, so use and load the polyfill.
    global.Intl = require('intl'); // eslint-disable-line
  }
};
