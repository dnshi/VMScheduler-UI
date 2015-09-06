'use strict';

// Modules
const
webpack = require('webpack'),
ngAnnotatePlugin = require('ng-annotate-webpack-plugin'),
HtmlWebpackPlugin = require('html-webpack-plugin'),
ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (CONF, build) => {
  /**
   * Environment type
   * BUILD is for generating minified builds
   */
  const BUILD = build;

  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  let config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   */
  config.entry = {
    app: BUILD ? CONF.js : [
      `webpack-dev-server/client?${CONF.hotModeUrl}`,
      'webpack/hot/dev-server',
      CONF.js
    ],
    vendors: [
      'jquery',
      'moment',
      'angular',
      'ui-router',
      'semantic',
      'fullcalendar',
      'fullcalendar-scheduler',
      'nprogress'
    ]
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   */
  config.output = {
    // Absolute output directory
    path: require('path').resolve(__dirname, CONF.static),

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: BUILD ? '/static/' : CONF.hotModeUrl,

    // Filename for entry points
    // Only adds hash in build mode
    filename: BUILD ? '[name].[chunkhash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: BUILD ? '[id].[chunkhash].js' : '[id].bundle.js'
  };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  config.devtool = BUILD ? false : 'inline-source-map';

  /**
   * Debug
   * Reference: http://webpack.github.io/docs/configuration.html#debug
   * Switch loaders to debug mode
   */
  config.debug = true;

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    preLoaders: [{
      // ESLint Loader
      // Reference: https://github.com/MoOx/eslint-loader
      //
      // The pluggable linting utility for JavaScript
      test: /(!min)\.js$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }, {
      // Script Loader
      // Reference: https://github.com/webpack/script-loader
      //
      // Execute files once in global context
      test: /\.min.js$/,
      loader: 'script'
    }],

    loaders: [{
      // JS Loader
      // Reference: https://github.com/babel/babel-loader
      //
      // Transpile .js files using babel-loader
      // Compiles ES6 and ES7 into ES5 code
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        optional: ['runtime', 'es7.classProperties'],
        stage: 0
      }
    }, {
      // Style & CSS Loader
      // Reference: https://github.com/webpack/style-loader
      // Reference: https://github.com/webpack/css-loader
      test: /\.css$/,
      loader: 'style!css'
    }, {
      // Stylus Loader
      // Reference: https://github.com/shama/stylus-loader
      //
      // Extract css files in production builds
      // Reference: https://github.com/webpack/extract-text-webpack-plugin
      test: /\.styl$/,
      loader: BUILD ? ExtractTextPlugin.extract('style', 'css?minimize!autoprefixer?browsers=last 2 version!stylus') : 'style!css?sourceMap!stylus'
    }, {
      // URL Loader
      // Reference: https://github.com/webpack/url-loader
      //
      // The url loader works like the file loader, but can return
      // a Data Url if the file is smaller than a limit.
      test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)$/,
      loader: 'url?limit=100000&name=resource/[hash:9].[ext]'
    }, {
      // File Loader
      // Reference: https://github.com/webpack/html-loader
      //
      // Exports HTML as string. HTML is minimized when the compiler demands.
      test: /\.html$/,
      loader: 'html'
    }]
  };

  config.eslint = {
    failOnError: true,
    formatter: require('eslint-friendly-formatter')
  };

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Extract css files
    // Disabled when in test mode or not in build mode
    new ExtractTextPlugin('main.[chunkhash].css', { allChunks: true, disable: !BUILD }),

    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    // Render index.html
    new HtmlWebpackPlugin({
      template: CONF.index,
      filename: BUILD ? '../index.html' : 'index.html',
      inject: 'body',
      minify: BUILD && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        preventAttributesEscaping: true,
        removeAttributeQuotes: true
      }
    }),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    // Split code into vendor and application
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: BUILD ? '[name].[hash].js' : '[name].bundle.js',
      minChunks: Infinity
    }),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#defineplugin
    // Define free variables. Useful for having development builds with
    // debug logging or adding global constants
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version)
    }),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#hotmodulereplacementplugin
    // Enables Hot Module Replacement
    new webpack.HotModuleReplacementPlugin()
  ];

  // Add build specific plugins
  if (BUILD) {
    config.plugins.push(
      // Reference: https://github.com/jeffling/ng-annotate-webpack-plugin
      // Runs ng-annotate on app's bundles
      new ngAnnotatePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#bannerplugin
      // Adds a banner to the top of each generated chunk
      new webpack.BannerPlugin(CONF.banner, { entryOnly: true }),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoErrorsPlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
      // Dedupe modules in the output
      new webpack.optimize.DedupePlugin(),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      // Minify all javascript, switch loaders to minimizing mode
      new webpack.optimize.UglifyJsPlugin({ sourceMap: false, exclude: /node_modules/ }),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#occurenceorderplugin
      // Assign the module and chunk ids by occurrence count
      new webpack.optimize.OccurenceOrderPlugin(true)
    );
  }

  return config;
};
