import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

export default ({ dev } = { dev: false }) => ({
  // target environment
  target: 'node', // nodeJs environment
  // target node options
  // use the actual dirname from source code directory
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: true,
    __dirname: true,
  },
  // cache result or previous build
  cache: !!dev,
  // generate source map method
  devtool: 'source-map',
  // entry
  externals: [
    ...fs.readdirSync(path.resolve(__dirname, '../node_modules')),
  ],
  // entry point for bundling
  entry: {
    main: [
      'babel-polyfill',
      path.join(process.cwd(), 'src/server/index.js'),
    ],
  },
  // Various output options, to give us a single bundle.js file
  // with everything resolved and concatenated
  output: {
    // output path
    path: path.join(process.cwd(), 'build/server'),
    // public path, used by webpack dev server and stats writer plugin
    publicPath: '/public/',
    // output file name, no need to use hash in server side
    filename: '[name].js',
    // output chunk file name, no need to use hash in server side
    // this file name is for non-entry chunks
    chunkFilename: '[name].chunk.js',
    // include comments with information about the modules.
    pathinfo: true,
    // target as commonjs2, so it would not transplie the require(...) code statement
    libraryTarget: 'commonjs2',
  },
  resolve: {
    // extensions used to resolve modules (rtl)
    extensions: ['.js', '.jsx', '.json', '.css'],
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
        // ignore all css
        test: /\.css$/,
        loader: 'ignore-loader',
        query: {
          name: dev ? '[path][name].[ext]' : '[name]-[hash].[ext]',
          limit: 10000,
        },
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
    // define global variable replacement
    new webpack.DefinePlugin({
      __CLIENT__: false,
      __SERVER__: true,
      __DEVELOPMENT__: dev,
    }),
    // Adds a banner to the top of each generated chunk
    // add source-map-support to enable server debugging
    // it make the stacktrace show the connect line number of source code
    // https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
    // https://github.com/evanw/node-source-map-support
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      include: /\.jsx?$/,
      raw: true,
      entryOnly: false,
    }),
  ],
});
