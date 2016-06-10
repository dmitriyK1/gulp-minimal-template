
// TODO: add documentation for features included

// TODO: add something from https://github.com/CSSSR/csssr-project-template

// TODO: add webpack

// TODO: add sprites task

// TODO: add iconfont task

// TODO: Use gulp-if for development/production
//
// add for css images inlining
// TODO: https://github.com/assetsjs/postcss-assets
//
// https://github.com/postcss/postcss-safe-parser

require('babel-core/register')

import fs                 from 'fs'
import path               from 'path'
import gulp               from 'gulp'
const plugins             = require('gulp-load-plugins')()
const isDebug             = process.env.NODE_ENV !== 'production'
import nib                from 'nib'
import critical           from 'critical'
import runSequence        from 'run-sequence'
import del                from 'del'
import lost               from 'lost'
import rupture            from 'rupture'
import typeUtils          from 'stylus-type-utils'
import browserSync        from 'browser-sync'
import eslintHtmlReporter from 'eslint-html-reporter'
import poststylus         from 'poststylus'

