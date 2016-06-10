// TODO: add documentation for features included

// TODO: add webpack

// TODO: add sprites task

// TODO: create paths file for all literal values

// TODO: Use gulp-if for development/production
//
// add for css images inlining
// TODO: https://github.com/assetsjs/postcss-assets
//
// https://github.com/postcss/postcss-safe-parser

require('babel-core/register')

global.gulp           = require('gulp')
global.plugins        = require('gulp-load-plugins')()
process.env.NODE_PATH = __dirname + '/dev'

require('module').Module._initPaths()
require('require-dir')('tasks')
