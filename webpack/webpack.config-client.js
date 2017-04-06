import path from 'path';
import webpack from 'webpack';
// https://github.com/webpack/extract-text-webpack-plugin
import ExtractTextPlugin from 'extract-text-webpack-plugin';
// https://github.com/kossnocorp/assets-webpack-plugin
import AssetsPlugin from 'assets-webpack-plugin';
// https://github.com/aackerman/circular-dependency-plugin
import CircularDependencyPlugin from 'circular-dependency-plugin';
// https://github.com/NekR/offline-plugin
import OfflinePlugin from 'offline-plugin';
// load the environment variable default value from .env file
import dotenv from 'dotenv';
dotenv.config();

export default ({ dev } = { dev: false }) => ({
  // target environment
  target: 'web', // Compile for usage in a browser-like environment
  // cache result or previous build
  cache: !!dev,
  // generate source map method
  // no source map in production
  // in development, SourceMaps from loaders are simplified to a single mapping per line.
  devtool: dev ? 'cheap-module-eval-source-map' : false,
  // entry point for bundling
  entry: {
    main: [
      ... dev ? [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?reload=true&path=http://0.0.0.0:8080/__webpack_hmr',
      ] : [],
      path.join(process.cwd(), 'src/app/index.js'),
    ],
    // third party js
    vendor: ['babel-polyfill', 'eventsource-polyfill', 'react', 'react-dom'],
  },
  // Various output options, to give us a single bundle.js file
  // with everything resolved and concatenated
  output: {
    // output path
    path: path.join(process.cwd(), 'build/app'),
    // public path, used by webpack dev server and stats writer plugin
    publicPath: dev ? 'http://0.0.0.0:8080/public/' : '/public/',
    // output file name, we use hash to prevent client cache in production
    filename: dev ? '[name].js' : '[name]-[chunkhash].js',
    // output chunk file name, we use hash to prevent client cache in production
    // this file name is for non-entry chunks
    chunkFilename: dev ? '[name].chunk.js' : '[name]-[chunkhash]-chunk.js',
    // include comments with information about the modules.
    pathinfo: true,
  },
  resolve: {
    // resolve from node_modules
    modules: ['node_modules'],
    // extensions used to resolve modules (rtl)
    extensions: ['.js', '.jsx', '.json'],
  },
  // module loaders
  module: {
    rules: [
      {
        // handle js and jsx files
        test: /\.jsx?$/,
        // exclude node_modules
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              // the given directory will be used to cache the results of the loader.
              // Future webpack builds will attempt to read from the cache to avoid
              // needing to run the potentially expensive Babel recompilation process
              // on each run
              cacheDirectory: !!dev,
            },
          },
        ],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader'],
        }),
      },
      {
        // handle images
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        loader: 'file-loader',
        query: {
          name: dev ? '[path][name].[ext]' : '[name]-[hash].[ext]',
        },
      },
      {
        // handle images
        test: /\.(png|jpg|gif)$/,
        // parse as hashed url
        use: [
          {
            loader: 'file-loader',
            query: {
              name: dev ? '[path][name].[ext]' : '[name]-[hash].[ext]',
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
      {
        // handle media file
        test: /\.(ico|wav|mp3|mp4|webm)$/,
        // parse as hashed url, must generate a file
        loader: 'file-loader',
        query: {
          name: dev ? '[path][name].[ext]' : '[name]-[hash].[ext]',
        },
      },
    ],
  },
  plugins: [
    // extract generated css/js as assets.json
    new AssetsPlugin({
      path: path.join(__dirname, '../build/'),
      // include the public path
      fullPath: true,
      prettyPrint: true,
      // process the output json format, throw the unnecessary information
      processOutput: (entries) => {
        // make sure vendor js must print out before the main js
        // so we can simplify the import js script
        const scripts = [entries.vendor.js, entries.main.js].filter(s => !!s);
        const styles = [entries.vendor.css, entries.main.css].filter(s => !!s);
        return JSON.stringify({ scripts, styles });
      },
    }),
    // define global variable replacement
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: dev,
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        LANGUAGES: JSON.stringify(process.env.LANGUAGES),
      },
    }),
    // vendor js, the entry point named vendor will be bundled as a separate js
    // which could serve for other entry points
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor', filename: dev ? 'vendor.js' : 'vendor-[chunkhash].js' }),
    // debug options
    new webpack.LoaderOptionsPlugin({
      // where loaders can be switched to minimize mode.
      minimize: !dev,
      // whether loaders should be in debug mode or not.
      debug: !!dev,
    }),
    // extract all the css bundled to a single css file
    new ExtractTextPlugin({
      filename: dev ? '[name].css' : '[name]-[chunkhash].css',
      allChunks: true,
    }),
    ...dev ? [
      // prints more readable module names in the browser console on HMR updates
      new webpack.NamedModulesPlugin(),
      // enable HMR globally
      new webpack.HotModuleReplacementPlugin(),
      // no emit on error
      new webpack.NoEmitOnErrorsPlugin(),
      // show a warning when there is a circular dependency
      new CircularDependencyPlugin({
        exclude: /a\.js|node_modules/,
        failOnError: false,
      }),
    ] : [
      // uglify js
      new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
      // offline plugin, service worker caching
      new OfflinePlugin(),
    ],
  ],
});
