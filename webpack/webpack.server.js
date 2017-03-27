/* eslint-disable import/no-extraneous-dependencies*/
import express from 'express';
import webpack from 'webpack';
import devMiddleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config-client';

const config = webpackConfig({ dev: true });
const compiler = webpack(config);
const serverOptions = {
  // the path of dev server
  contentBase: 'http://0.0.0.0:8080',
  noInfo: true,
  silent: true,
  stats: 'errors-only',
  // the public path of the location of js
  publicPath: config.output.publicPath,
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
    console.info('Webpack development server listening on port %s', '8080'); // eslint-disable-line no-console
  }
}

// start the webpack-dev-server
app.listen(8080, callback);
