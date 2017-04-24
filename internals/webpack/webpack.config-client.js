/**
 * Webpack configuration for client
 */

import config from '_internals/config';
import configFactory from '_internals/webpack/utils/configFactory';

export default configFactory({
  target: 'client',
  env: process.env.NODE_ENV || 'development',
}, config);
