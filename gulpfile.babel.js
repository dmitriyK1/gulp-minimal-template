
// TODO: use gulp 4

// TODO: add something from https://medium.com/evil-martians/postcss-2nd-birthday-2c76c223c78f#.6n345sb0p

// http://chouchenn.switch.paris/
// http://kouto-swiss.io/docs.html
// http://axis.netlify.com/
// https://github.com/niallobrien/stylus-ui

// TODO: add something from https://github.com/tars/tars

// TODO: postcss-normalize - load via postcss

// TODO: add https://github.com/ben-eb/postcss-normalize-url
// TODO: add https://github.com/TrySound/postcss-normalize-charset

// TODO: fix stylus sourcemaps

// TODO: ??? add iconfont template as npm package

// TODO: ??? promisify deploy:surge

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
// https://github.com/purifycss/gulp-purifycss

require('babel-core/register')

global.gulp    = require('gulp')
global.plugins = require('gulp-load-plugins')()
global.paths   = require('./paths')

require('require-dir')('tasks')
