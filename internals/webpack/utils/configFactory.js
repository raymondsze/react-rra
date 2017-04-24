/**
 * Webpack configuration factory, client and server configuration
 * are genarted using this configuration factory.
 * Configuration are generated based on the target and environment.
 * Allowed target: client/server
 * Allowed environment: development/staging/uat/production
 */
/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import fs from 'fs';
import url from 'url';
import appRootDir from 'app-root-dir';
import webpack from 'webpack';
// ExtractTextPlugin is used in production mode, all the css are bundled as a single css file
import ExtractTextPlugin from 'extract-text-webpack-plugin';
// AssetsPlugin is used to let server know the bundled filenames with hash attached
// during runtime environment
import AssetsPlugin from 'assets-webpack-plugin';
// Detect circular dependency
import CircularDependencyPlugin from 'circular-dependency-plugin';
// OfflinePlugin, generate service worker that cache all the assets into local storage
import OfflinePlugin from 'offline-plugin';
// HtmlWebpackPlugin, used to append the generated js and css files
// as script and style tags into html template
// This is used for offline access with the service worker defined in offline plugin
import HtmlWebpackPlugin from 'html-webpack-plugin';
// All node modules defined in dependencies would be resolved, used for server bundling
import nodeExternals from 'webpack-node-externals';
// Input schema validation
import Joi from 'joi';
// Replace chunkhash with md5, depending on the file content
import WebpackMd5Hash from 'webpack-md5-hash';
// Fasten the development process by utilizing multiple thread for webpack loaders
import HappyPack from 'happypack';

// Valid target values
const TARGETS = {
  CLIENT: 'client',
  SERVER: 'server',
};

// Valid environment values
const ENVS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  UAT: 'uat',
  PRODUCTION: 'production',
};

// Schema for option validation
const optionsSchema = Joi.object({
  // target, it could be client/server
  target: Joi.any().allow(Object.values(TARGETS)).required(),
  // environment, it could be development/staging/uat/producction
  env: Joi.any().allow(Object.values(ENVS)).required(),
});


// Configuration factory, generate the webpack configuration
function configFactory(options, config) {
  // validate the input arguments
  const { error } = optionsSchema.validate(options);
  if (error) throw error;

  const { target, env } = options;

  // development mode or production mode
  const devMode = (env === ENVS.DEVELOPMENT);
  const prodMode = (env !== ENVS.DEVELOPMENT);

  // client mode or server mode
  const clientMode = (target === TARGETS.CLIENT);
  const serverMode = (target === TARGETS.SERVER);

  const rootDir = appRootDir.get();
  const { host, client, server } = config;

  const hook = clientMode ? client.webpack : server.webpack;
  // the webpack configuration
  return hook({
    // target mode
    target: clientMode ? 'web' : 'node',
    // use the source __dirname and __filename if target is node environment
    node: {
      __dirname: true,
      __filename: true,
    },
    // dev tools, server environment or production do not need any source map
    devtool: serverMode ? 'inline-source-map' : (prodMode ? 'hidden-source-map' : 'cheap-module-eval-source-map'),
    // enable performance hints warning for client mode
    performance: (clientMode && prodMode) ? { hints: 'warning' } : false,
    // input entry
    entry: {
      // produce index.js
      index: [
        // necessary for hot reloading with IE
        clientMode ? 'eventsource-polyfill' : null,
        // enable babel-polyfill if client mode
        clientMode ? 'babel-polyfill' : null,
        // enable react-hot-loader if client mode and development mode
        (clientMode && devMode) ? 'react-hot-loader/patch' : null,
        // enable hot-reload if client mode and development mode
        (clientMode && devMode) ?
          // load the js hot update from the webpack dev server
          `webpack-hot-middleware/client?reload=true&path=http://${host}:${client.development.port}/__webpack_hmr` : null,
        // input js file
        clientMode ?
          path.resolve(rootDir, client.srcEntryFile) :
          path.resolve(rootDir, server.srcEntryFile),
      ].filter(v => v),
    },
    // output
    output: {
      // the output folder
      path: clientMode ?
        path.resolve(rootDir, client.outputPath) :
        path.resolve(rootDir, server.outputPath),
      // the output filename, [name] is the input entry name.
      // append chunkhash if client mode and production mode
      filename: (devMode || serverMode) ? '[name].js' : '[name]-[chunkhash].js',
      // the output filename for other chunk
      chunkFilename: '[name]-[chunkhash].js',
      // if server mode, the target should be commonjs2 (i.e module.exports)
      // if client mode, use var instead (i.e window)
      libraryTarget: serverMode ? 'commonjs2' : 'var',
      // the public access path
      // if development mode, dev server is started, all js should load from
      // the public path of dev server
      // otherwise, use public path with local server instead
      publicPath: devMode ? url.format({
        protocol: 'http',
        hostname: host,
        port: client.development.port,
        pathname: client.publicPath,
      }) : client.publicPath,
    },
    // resolve modules from node_modules and corresponding extensions
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.json'],
    },
    // external modules, for server side, except the css, all modules are excluded
    externals: [
      serverMode ? nodeExternals({
        // all the css have to be loaded via webpack
        whitelist: server.includes,
      }) : null,
    ].filter(v => v),
    // loaders
    module: {
      rules: [
        {
          // all js and jsx files are using happypack-js loader which defined in plugin section
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'happypack/loader?id=happypack-js',
        },
        // if client mode and production mode, css are bundled and extracted as single css file
        (clientMode && prodMode) ? {
          test: /\.css$/,
          // enforce styled-components, only allow import css from third party modules
          include: /node_modules/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader'],
          }),
        } : null,
        // if client mode and develpoment mode, use happy-css loader which defined in plugin section
        (clientMode && devMode) ? {
          test: /\.css$/,
          // enforce styled-components, only allow import css from third party modules
          include: /node_modules/,
          loader: 'happypack/loader?id=happypack-css',
        } : null,
        // if server mode, css are all ignored
        (serverMode) ? {
          test: /\.css$/,
          loader: 'ignore-loader',
        } : null,
        // all gql are using graphql-tag/loader
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
        // all html files are loaded with html-loader
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
        // image files
        {
          test: /\.(jpg|png|gif)$/,
          loaders: [
            {
              loader: 'file-loader',
              query: {
                emitFile: clientMode,
              },
            },
            {
              loader: 'image-webpack-loader',
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: false,
                },
                optipng: {
                  optimizationLevel: 7,
                },
                pngquant: {
                  quality: '65-90',
                  speed: 4,
                },
              },
            },
          ],
        },
        // media files
        {
          test: /\.(mp4|webm)$/,
          loader: 'url-loader',
          query: {
            // if the file is greater than the limit (in bytes) the file-loader is used
            limit: 10000,
            // only emit files when client mode
            emitFile: clientMode,
          },
        },
        // other assets files which need file-loader to produce the correct url
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          loader: 'file-loader',
          query: {
            // only emit files when client mode
            emitFile: clientMode,
          },
        },
      ].filter(v => v),
    },
    plugins: [
      // inject source-map-support to server bundled js, for easier debugging
      serverMode ? new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        include: /\.jsx?$/,
        raw: true,
        entryOnly: false,
      }) : null,
      // if client mode, enable webpack md5 hash to replace chunkhash to content hash
      clientMode ? new WebpackMd5Hash() : null,
      // if client mode, produce webpack-assets.json to
      // let server detect the correct path of all js and css
      clientMode ? new AssetsPlugin({
        // the assets json file name
        filename: client.assetsJsonFilename,
        // output path
        path: client.outputPath,
        // produce full path (include public path)
        fullPath: true,
        // pretty print the json
        prettyPrint: true,
      }) : null,
      // if development mode, enable named modules plugin for easier debugging
      devMode ? new webpack.NamedModulesPlugin() : null,
      // if development mode, only emit files when no error
      devMode ? new webpack.NoEmitOnErrorsPlugin() : null,
      // if development mode, enable module.hot
      devMode ? new webpack.HotModuleReplacementPlugin() : null,
      // if development mode, detect any circular dependency
      devMode ? new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: false,
      }) : null,
      // if client mode and development mode, enable dll reference plugin for faster development
      // dll refernce plugin loads all the vendor js defined in a json file
      // this is used to separate vendor modules from current bundle build
      (clientMode && devMode) ? new webpack.DllReferencePlugin({
        /* eslint-disable import/no-dynamic-require, global-require */
        manifest: require(
          (() => {
            const manifestFilePath = client.development.vendorDll.manifest;
            if (!fs.existsSync(manifestFilePath)) {
              console.error('The DLL manifest is missing. Please run `npm run build:dll`');
              process.exit(0);
            }
            return client.development.vendorDll.manifest;
          })(),
        ),
        /* eslint-enable import/no-dynamic-require, global-require */
      }) : null,
      // if client and production mode, minimze all the js
      (clientMode && prodMode) ? new webpack.LoaderOptionsPlugin({
        minimize: true,
      }) : null,
      // if client and production mode, uglify all the js
      (clientMode && prodMode) ? new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      }) : null,
      // if client mode and production mode, extract all the css to a single css file with chunkhash
      (clientMode && prodMode) ? new ExtractTextPlugin({
        filename: '[name]-[chunkhash].css',
        allChunks: true,
      }) : null,
      // generate the index.html from html template by injecting
      // the script and style tags of current build
      (clientMode && prodMode) ? new HtmlWebpackPlugin({
        // the html template filename
        filename: client.serviceWorker.offline.filename,
        template: `babel-loader!${path.resolve(rootDir, client.serviceWorker.offline.template)}`,
        // optimization to the html template
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeNilAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        },
        // inject css and js
        inject: true,
      }) : null,
      // if client mode and production mode, enable offlineplugin to genrate service worker js
      // service worker could cache all the response and assets to local storage of client browser
      (clientMode && prodMode) ? new OfflinePlugin({
        relativePaths: false,
        publicPath: client.publicPath,
        ServiceWorker: {
          output: client.serviceWorker.filename,
          events: true,
          publicPath: client.serviceWorker.filename,
          navigateFallbackURL: path.resolve(client.publicPath, client.serviceWorker.offline.filename),
          entry: client.serviceWorker.entry,
        },
        // application cache is deprecated
        AppCache: false,
      }) : null,
      // provide plugin, polyfill fetch
      new webpack.ProvidePlugin({
        // make fetch available
        fetch: 'exports-loader?self.fetch!whatwg-fetch',
      }),
      // environment plugin, inject default value to process.env
      new webpack.EnvironmentPlugin({
        ENV: env,
        NODE_ENV: devMode ? 'development' : 'production',
        TARGET: clientMode ? 'client' : 'server',
      }),
      // happy pack loader for javascript
      new HappyPack({
        id: 'happypack-js',
        threads: 4,
        verbose: false,
        loaders: [
          {
            // use babel-loader
            path: 'babel-loader',
            query: {
              // do not use the .babelrc
              babelrc: false,
              // define all the presets
              presets: [
                clientMode ? ['env', {
                  targets: {
                    browsers: ['last 2 versions', '> 5%'],
                  },
                }] : null,
                serverMode ? ['env', {
                  targets: {
                    node: true,
                  },
                }] : null,
                'stage-0',
                'react',
              ].filter(v => v),
              // define all the plugins
              plugins: [
                // debugging for react
                (clientMode && devMode) ? 'react-hot-loader/babel' : null,
                devMode ? 'transform-react-jsx-self' : null,
                devMode ? 'transform-react-jsx-source' : null,
                // optimization for react
                prodMode ? 'transform-react-inline-elements' : null,
                prodMode ? 'transform-react-constant-elements' : null,
                prodMode ? 'transform-react-remove-prop-types' : null,
                prodMode ? 'transform-react-pure-class-to-function' : null,
                // enable decorator support
                'transform-decorators-legacy',
                // enable dynamic import syntax
                'syntax-dynamic-import',
                // convert dynamic import to a deferred require()
                // here we use the dynamic import for webpack instead
                // remove the dynamic-import-node
                // use dynamic-import-webpack instead
                'dynamic-import-webpack',
                // enable styled-components, support ssr, do the minification if production mode
                ['styled-components', {
                  ssr: true,
                  minify: !devMode,
                }],
                // enable react-intl, all the defineMessages will be extracted to messagesDir
                ['react-intl', {
                  messagesDir: client.intl.messagesDir,
                }],
                // enable module-resolver, shorthands to src/client, src/server, src/internals, etc
                ['module-resolver', {
                  // capture all supported extensions
                  // here the settings should be same as .babelrc
                  // in order to match the module alias that .babelrc resolve to
                  ...(() => {
                    const babelrcFile = path.resolve(rootDir, '.babelrc');
                    if (fs.existsSync(babelrcFile)) {
                      const content = fs.readFileSync(babelrcFile, 'utf8');
                      const json = JSON.parse(content);
                      const moduleResolverPlugin = json.plugins.find(plugin =>
                        plugin instanceof Array && plugin[0] === 'module-resolver',
                      );
                      if (!moduleResolverPlugin) {
                        console.error(
                          'The module-resolver plugin is missing in the .babelrc file.\n' +
                          'Please make sure the plugin is specified.');
                        return process.exit(0);
                      }
                      const pluginOptions = moduleResolverPlugin[1];
                      return pluginOptions;
                    }
                    console.error(
                      'The .babelrc is missing. \n' +
                      'Please check if .babelrc is in the root directory.');
                    return process.exit(0);
                  })(),
                }],
              ].filter(v => v),
            },
          },
        ],
      }),
      // happy pack loader for css
      new HappyPack({
        id: 'happypack-css',
        threads: 4,
        verbose: false,
        loaders: [
          'style-loader', 'css-loader',
        ],
      }),
    ].filter(v => v),
  });
}

export default configFactory;
