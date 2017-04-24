/**
 * Webpack dev server
 */
/* eslint-disable import/no-extraneous-dependencies*/
import Promise from 'bluebird';
import express from 'express';
import webpack from 'webpack';
// webpack dev middleware, no files are written to disk
import devMiddleware from 'webpack-dev-middleware';
// webpack hot middleware, enable module.hot
import hotMiddleware from 'webpack-hot-middleware';
import config from '_internals/config';
import dllConfigFactory from '_internals/webpack/utils/dllConfigFactory';
import configFactory from '_internals/webpack/utils/configFactory';

// Start the webpack dev server
async function startDevServer() {
  const options = {
    target: 'client',
    env: process.env.NODE_ENV || 'development',
  };
  const dllOptions = {
    target: 'client',
    env: process.env.NODE_ENV || 'development',
  };
  // get the vendor dll webpack configuration
  const dllConfig = dllConfigFactory(dllOptions, config);
  // obtain the compiler
  const dllCompiler = webpack(dllConfig);
  // wait the bundling finish
  await Promise.promisify(dllCompiler.run).bind(dllCompiler)();
  // get the webpack configuration for client
  const webpackConfig = configFactory(options, config);
  const { host, devPort } = options;
  // obtain the compiler
  const compiler = webpack(webpackConfig);
  // create the webpack dev server
  const serverOptions = {
    // the path of dev server
    contentBase: `http://${host}:${devPort}`,
    noInfo: true,
    silent: true,
    stats: 'errors-only',
    // the public path of the location of js
    publicPath: '/public/',
    // enable cross domain
    headers: { 'Access-Control-Allow-Origin': '*' },
  };
  const app = express();
  // no files are written to disk, it handle the files in memory
  app.use(devMiddleware(compiler, serverOptions));
  // works when hmr is enabled, enable module.hot
  app.use(hotMiddleware(compiler));

  function callback(err) {
    if (err) {
      console.error(err); // eslint-disable-line no-console
    } else {
      console.info('Webpack development server listening on port %s', devPort); // eslint-disable-line no-console
    }
  }
  // start the webpack-dev-server
  app.listen(devPort, callback);
  return app;
}

export default startDevServer();
