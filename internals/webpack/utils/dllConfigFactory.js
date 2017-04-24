/**
 * Webpack configuration factory for vendor DDL.
 * Only enabled in development mode.
 * All modules defined as vendor would be bundled using this webpack configuration.
 * json file is generated during the build to make DllReferencePlugin work.
 * Allowed target: client
 * Allowed environment: development
 */
/* eslint-disable import/no-extraneous-dependencies */
import webpack from 'webpack';
import path from 'path';
import appRootDir from 'app-root-dir';
// Input schema validation
import Joi from 'joi';

// Valid target values
const TARGETS = {
  CLIENT: 'client',
};

// Valid environment values
const ENVS = {
  DEVELOPMENT: 'development',
};

// Schema for option validation
const optionsSchema = Joi.object({
  target: Joi.any().allow(Object.values(TARGETS)).required(),
  env: Joi.any().allow(Object.values(ENVS)).required(),
}).unknown();

// Configuration factory, generate the webpack configuration
function configFactory(options, config) {
  // validate the input arguments
  const { error } = optionsSchema.validate(options);
  if (error) throw error;

  const { client } = config;
  const rootDir = appRootDir.get();
  // webpack configuration
  return {
    devtool: 'cheap-module-eval-source-map',
    // input entry
    entry: {
      // the vendor dll name
      [client.development.vendorDll.variable]: [
        // dependencies required to bundle into vendor dll
        ...client.development.vendorDll.includes,
      ],
    },
    output: {
      // output path
      path: path.resolve(rootDir, client.outputPath),
      // output filename
      filename: client.development.vendorDll.filename,
      // The name of the global variable which the library's
      // require() function will be assigned to
      library: client.development.vendorDll.variable,
    },
    plugins: [
      // webpack dll plugin
      new webpack.DllPlugin({
        // the output json file
        path: path.resolve(rootDir, client.development.vendorDll.manifest),
        // global variable name
        name: client.development.vendorDll.variable,
      }),
    ],
  };
}

export default configFactory;
