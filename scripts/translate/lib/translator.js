import parser from 'intl-messageformat-parser'; // eslint-disable-line import/no-extraneous-dependencies
import print from '~/../scripts/translate/lib/printer';

export default class Translator {
  constructor(translateText) {
    this.translateText = translateText;
  }
  translate(message) {
    const ast = parser.parse(message);
    const translated = this.transform(ast);
    return print(translated);
  }
  transform(ast) {
    ast.elements.forEach((el) => {
      const _el = el; // eslint-disable-line
      if (_el.type === 'messageTextElement') {
        _el.value = this.translateText(_el.value);
      } else {
        const options = _el.format && _el.format.options;
        if (options) {
          options.forEach(option => this.transform(option.value));
        }
      }
    });
    return ast;
  }
}
