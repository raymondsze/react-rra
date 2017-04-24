/**
 * Webpack configuration for server
 */

import config from '_internals/config';
import configFactory from '_internals/webpack/utils/configFactory';

export default configFactory({
  target: 'server',
  env: process.env.NODE_ENV || 'development',
}, config);
