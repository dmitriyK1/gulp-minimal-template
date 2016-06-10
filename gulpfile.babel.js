// TODO: ??? add iconfont template as npm package

// TODO: add documentation for features included
// TODO: add use cases of features on page in separate sections

// TODO: add webpack

// TODO: Use gulp-if for development/production
//
// add for css images inlining
// TODO: https://github.com/assetsjs/postcss-assets
  // body {
  // background: resolve('foobar.jpg');
  // background: inline('images/foobar.png');

// https://github.com/postcss/postcss-safe-parser

require('babel-core/register')

global.gulp    = require('gulp')
global.plugins = require('gulp-load-plugins')()
global.paths   = require('./paths')

require('require-dir')('tasks')
