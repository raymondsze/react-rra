/**
 * Webpack configuration for vendor dll
 */

import config from '_internals/config';
import dllConfigFactory from '_internals/webpack/utils/dllConfigFactory';

export default dllConfigFactory({
  target: 'client',
  env: process.env.NODE_ENV || 'development',
}, config);
