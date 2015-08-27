'use strict';

const
gulp = require('gulp'),
webpack = require('webpack'),
gutil = require('gulp-util'),
del = require('del'),
pkg = require('./package.json'),
WebpackDevServer = require('webpack-dev-server');

var CONF, BUILD = false;

// Setup environment
gulp.task('env', () => {
  gutil.log('Current Env is', gutil.colors.magenta.bold(BUILD ? 'prod' : 'dev'));
  CONF = {
    js: './assets/app/app.js',
    index: './assets/index.html',
    root: `./${BUILD ? 'dist' : 'www'}`,
    static: `./${BUILD ? 'dist' : 'www'}/static`,
    banner: `${pkg.name}\n@version v${pkg.version}\nCopyright 2015 ${pkg.author}`,

    host: 'localhost',
    port: '9090',
    get hotModeUrl() {
      return `http://${this.host}:${this.port}/`;
    }
  }
});

// Run Webpack
gulp.task('webpack', ['clean'], (cb) => {
  let config = require('./webpack.config')(CONF, BUILD);

  if (!BUILD) {
    new WebpackDevServer(webpack(config), {
      contentBase: CONF.root,
      publicPath: CONF.hotModeUrl,
      stats: { colors: true }
    }).listen(CONF.port, CONF.host, (err) => {
      if (err) throw new gutil.PluginError('webpack-dev-server', err);
      gutil.log(gutil.colors.yellow.underline('[webpack-dev-server] is running on port'), gutil.colors.bold.red(CONF.port));
    });
  } else {
    webpack(config, (err, stats) => {
      if (err) throw new gutil.PluginError('webpack-build', err);
      gutil.log('[webpack-build]', stats.toString({ colors: true }));
      cb();
    });
  }
});

// Clean dest dir
gulp.task('clean', ['env'], (cb) => del(CONF.root, cb));

// Build the project to production
gulp.task('build', () => (BUILD = true) && gulp.start('webpack'));

// Run the project for development
gulp.task('default', ['webpack']);
