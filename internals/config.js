import path from 'path';
// Input schema validation
import Joi from 'joi';
import hook from '_config';

const appDirectory = process.cwd();
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

const configSchema = Joi.object({
  host: Joi.string().hostname().required(),
  port: Joi.number().required(),
  client: Joi.object({
    srcEntryFile: Joi.string().required(),
    outputPath: Joi.string().required(),
    public: Joi.string().required(),
    publicPath: Joi.string().required(),
    assetsJsonFilename: Joi.string().required(),
    intl: Joi.object({
      messagesDir: Joi.string().required(),
    }).required(),
    serviceWorker: Joi.object({
      filename: Joi.string().required(),
      entry: Joi.string().required(),
      offline: Joi.object({
        filename: Joi.string().required(),
        template: Joi.string().required(),
      }).required(),
    }).required(),
    development: Joi.object({
      port: Joi.number().required(),
      vendorDll: Joi.object({
        filename: Joi.string().required(),
        includes: Joi.array().items(Joi.string()).required(),
        variable: Joi.string().required(),
        manifest: Joi.string().required(),
      }).required(),
    }).required(),
    webpack: Joi.func().required(),
  }).required(),
  server: Joi.object({
    srcEntryFile: Joi.string().required(),
    outputPath: Joi.string().required(),
    graphql: Joi.object({
      schemaFile: Joi.string().required(),
    }),
    includes: Joi.array()
      .items(Joi.string(), Joi.object().type(RegExp)).required(),
    webpack: Joi.func().required(),
  }).required(),
});

const config = hook({
  host: '0.0.0.0',
  port: 3000,
  client: {
    srcEntryFile: resolveApp('client/index.js'),
    outputPath: resolveApp('build/client'),
    public: resolveApp('build/client/public'),
    publicPath: '/public/',
    assetsJsonFilename: 'webpack-assets.json',
    intl: {
      messagesDir: resolveApp('build/intl'),
    },
    serviceWorker: {
      filename: 'sw.js',
      entry: resolveApp('client/sw.js'),
      offline: {
        filename: 'offline.html',
        template: resolveApp('server/templates/offline.jsx'),
      },
    },
    development: {
      port: 8080,
      vendorDll: {
        filename: 'vendor_dll.js',
        includes: [
          'eventsource-polyfill',
          'babel-polyfill',
          'react',
          'react-dom',
          'react-router',
          'react-router-dom',
          'react-router-redux',
          'react-async-component',
          'react-helmet',
          'react-redux',
          'react-apollo',
          'redux',
          'redux-form',
          'redux-saga',
          'reselect',
          'immutable',
        ],
        variable: '__VENDOR_DLL__',
        manifest: resolveApp('build/client/vendor_dll.json'),
      },
    },
    webpack: webpackConfig => webpackConfig,
  },
  server: {
    srcEntryFile: resolveApp('server/index.js'),
    outputPath: resolveApp('build/server'),
    graphql: {
      schemaFile: resolveApp('server/schema.js'),
    },
    includes: [
      /^.*\.css/,
    ],
    webpack: webpackConfig => webpackConfig,
  },
});

// validate the input arguments
const { error } = configSchema.validate(config);
if (error) throw error;

export default config;
