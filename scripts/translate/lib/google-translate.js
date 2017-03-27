// https://www.npmjs.com/package/translateer
import translator from 'translateer'; // eslint-disable-line import/no-extraneous-dependencies

export default function translate(message, from, to) {
  return translator.translate({
    q: message,
    from,
    to,
    version: '2.0',
  }).then(res =>
    res.json(),
  ).then(json =>
    json.sentences[0].trans,
  ).catch(() => {
    console.error(`unable to translate message: ${message}, use original message instead.`); // eslint-disable-line
    return message;
  });
}
