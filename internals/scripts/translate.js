/* eslint-disable import/no-extraneous-dependencies */
import appRootDir from 'app-root-dir';
import path from 'path';
import fs from 'fs';
import { sync as globSync } from 'glob';
import translations from '_intl/messages';

const TRANSLATIONS_DIR = 'intl/messages';
const MESSAGES_PATTERN = 'build/intl/**/*.json';

const languages = process.argv.slice(2);

if (!languages || languages.length === 0) {
  console.error(
    'Please speicify the language you want to extract.\n' +
    'Example usage: \tyarn run script:translate en zh-Hans zh-Hant',
  );
  process.exit(0);
}

// Aggregates the default messages that were extracted from the example app’s
// React components via the React Intl Babel plugin. An error will be thrown if
// there are messages in different components that use the same `id`. The result
// is a flat collection of `id: message` pairs for the app’s default locale.
const messages = {};
const hashSet = new Set();
globSync(path.resolve(appRootDir.get(), MESSAGES_PATTERN))
  .map(filename => fs.readFileSync(filename, 'utf8'))
  .map(file => JSON.parse(file))
  .forEach((descriptors) => {
    descriptors.forEach(({ id, defaultMessage }) => {
      if (hashSet.has(id)) {
        console.error(
          `Message with id: ${id} is already defined.\n` +
          'Please remove the duplication and try again',
        );
      }
      hashSet.add(id);
      languages.forEach((lang) => {
        const trans = translations[lang] && translations[lang][id];
        messages[lang] = messages[lang] || {};
        messages[lang][id] = trans || defaultMessage;
      });
    });
  }, {});

// write the messages to corresponding json
Object.entries(messages).forEach(([lang, msgs]) => {
  fs.writeFileSync(path.resolve(appRootDir.get(), `${TRANSLATIONS_DIR}/${lang}.json`),
    JSON.stringify(msgs, null, 2));
});
