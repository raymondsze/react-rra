import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
/* eslint-disable import/no-extraneous-dependencies */
import { sync as globSync } from 'glob';
import { sync as delSync } from 'del';
/* eslint-enable import/no-extraneous-dependencies */
import translations from '~/app/translations';

const TRANSLATIONS_DIR = path.join(process.cwd(), 'src/app/translations');
const MESSAGES_PATTERN = path.join(process.cwd(), 'build/messages/**/*.json');
const LANGUAGE_MAPPINGS = {
  'zh-Hans': 'zh-cn',
  'zh-Hant': 'zh-tw',
};
const LANGUAGE_SUPPORTS = JSON.parse(process.env.LANGUAGES);
console.log(`Target languages: ${LANGUAGE_SUPPORTS}`); // eslint-disable-line no-console
/*
  1. get supporting language
  2. grab all the messages from build folder (MESSAGES_PATTERN)
     which generated from babel-react-intl plugin
  3. for each message per langauge, copy the message if not exists
     in translation folder (TRANSLATIONS_DIR)
  4. generate the message to the lang folder (LANG_DIR)
     which would be required when starting server
  5. clone the messages back to translation folder (TRANSLATIONS_DIR)
*/
const messages = LANGUAGE_SUPPORTS.reduce((result, sup) => {
  const _result = result; // eslint-disable-line
  _result[sup] = {};
  return result;
}, {});
const hashSet = new Set();

// Aggregates the default messages that were extracted from the example app’s
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app’s default locale.
delSync([path.resolve(process.cwd(), 'build/messages/lang')]);
globSync(path.resolve(process.cwd(), MESSAGES_PATTERN))
  .map(filename => fs.readFileSync(filename, 'utf8'))
  .map(file => JSON.parse(file))
  .forEach((descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      hashSet.add(id);
      LANGUAGE_SUPPORTS.forEach((sup) => {
        const trans = translations[sup] && translations[sup][id];
        messages[sup][id] = defaultMessage;
      });
    });
  }, {});

// write the messages to corresponding folders
Object.entries(messages).forEach(([sup, msgs]) => {
  fs.writeFileSync(path.resolve(__dirname, `${TRANSLATIONS_DIR}/${sup}.json`),
  JSON.stringify({ ...translations[sup], ...msgs }, null, 2));
});
