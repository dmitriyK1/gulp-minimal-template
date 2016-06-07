// TODO: add something from https://github.com/CSSSR/csssr-project-template

// TODO: split config into separate task files

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
const isProduction        = plugins.util.env.p
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

const posthtmlBemConfig = {
        elemPrefix: '__'
      , modPrefix: '--'
      , modDlmtr: '_'
}

const posthtmlPlugins = [
      require('posthtml-lorem')()
    , require('posthtml-bem-sugar')()
    , require('posthtml-bem')( posthtmlBemConfig )
]

gulp.task( 'scripts', () =>
    gulp
        .src('./dev/scripts/js/init.js')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.changed( './build/js', { extension: '.js' } ) )
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.babel() )
        .pipe(plugins.fixmyjs({
            lookup   : true,
            curly    : true,
            es3      : true,
            nonew    : true,
            multivar : true,
            debug    : false
        }))
        .pipe( plugins.jsbeautifier({ config: '.jsbeautifyrc' }) )
        .pipe( plugins.jscs({ fix: true }) )
        .pipe( plugins.eslint({ fix: true }) )
        .pipe( plugins.eslint.format( eslintHtmlReporter, results => fs.writeFileSync(path.join(__dirname, 'reports/eslint.html'), results) ))
        .pipe( plugins.eslint.format() )
        .pipe( plugins.ngAnnotate() )
        .pipe( plugins.sourcemaps.write('.') )
        .pipe( gulp.dest('./build/js') )
)

gulp.task( 'templates', () =>
    gulp
        .src('./dev/templates/pages/**/*.jade')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.changed( './build', { extension: '.html' } ) )
        .pipe( plugins.jade({ pretty: true }) )
        .pipe( plugins.posthtml( posthtmlPlugins ) )
        .pipe(
            plugins.prettify({
                  brace_style       : 'expand'
                , indent_size       : 1
                , indent_char       : '\t'
                , indent_with_tabs  : true
                , condense          : true
                , indent_inner_html : true
                , preserve_newlines : true
            })
        )
        .pipe( gulp.dest('./build') )
)

gulp.task('rev', () =>
    gulp
    .src('./build/*.html')
    .pipe( plugins.revAppend() )
    .pipe( gulp.dest('./build/') )
)

gulp.task( 'styles', () =>
    gulp
        .src('./dev/styles/main.styl')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.changed( './build/css', { extension: '.css' } ) )
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.stylus({
            use: [
                  nib()
                , typeUtils()
                , poststylus([ 'lost', 'rucksack-css', 'postcss-position', 'postcss-normalize', 'postcss-cssnext', 'postcss-remove-prefixes', 'postcss-flexboxfixer', 'postcss-gradientfixer' ])
                , rupture()
                  // poststylus([ 'rucksack-css', 'postcss-autoreset', 'postcss-initial', 'postcss-position', 'postcss-normalize', 'postcss-cssnext' ])
            ]
            , 'include css': true
        }))
        .pipe( plugins.if(!isDebug, plugins.groupCssMediaQueries()) )
        .pipe( plugins.csscomb() )
        .pipe( plugins.autoprefixer() )
        .pipe( plugins.sourcemaps.write('.') )
        .pipe( gulp.dest('./build/css') )
        .pipe( browserSync.stream({ match: '**/*.css' }) )
)

gulp.task('styles:lint', () => (
    gulp
        .src(['dev/styles/main.styl'])
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.stylint({
              config          : '.stylintrc'
            , reporter        : 'stylint-stylish'
            , reporterOptions : { verbose: true }
        }))
        .pipe( plugins.logCapture.start(process.stdout, 'write') )
        .pipe( plugins.stylint.reporter() )
        .pipe( plugins.logCapture.stop('xml') )
        .pipe( gulp.dest('reports/stylint') )
))

gulp.task( 'clean', () => del.sync([ 'build/**/*', 'reports/**/*' ]) )

gulp.task('serve', () =>
    browserSync.init({
          server          : { baseDir: 'build' }
        , reloadOnRestart : true
        , open            : true
        , notify          : false
        , logFileChanges  : false
        , watchOptions    : { ignored: '*.map' }
    })
)

gulp.task( 'compress', () => {
    if( !isProduction ) return

    gulp
        .src('build/js/*.js')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.stripDebug() )
        .pipe( plugins.uglify({ mangle: true }) )
        .pipe( gulp.dest('build/js') )

    gulp
        .src('build/*.html')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.htmlmin({ collapseWhitespace: true }) )
        .pipe( plugins.minifyInline() )
        .pipe( gulp.dest('build') )

    gulp
        .src('build/css/*.css')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.mergeMediaQueries() )
        .pipe( plugins.csso() )
        .pipe( plugins.cssnano({
                discardComments: { removeAll: true }
            })
        )
        .pipe( gulp.dest('build/css') )
})

gulp.task( 'critical', () => critical.generate({
        inline : true
      , base   : 'build/'
      , src    : 'index.html'
      , dest   : 'build/index-critical.html'
      , width  : 1300
      , height : 900
  })
)

gulp.task( 'copy', () =>
  gulp
    .src('dev/assets/**/*')
    .pipe( plugins.changed('build') )
    .pipe( gulp.dest('build') )
)

gulp.task( 'help', plugins.taskListing )

gulp.task( 'build', () =>
    runSequence(
          [
              'clean'
            , 'copy'
            , 'scripts'
            , 'templates'
            , 'styles'
          ]
            , 'rev'
            , 'styles:lint'
            , 'compress'
    )
)

gulp.task( 'watch', () => {
    gulp.watch( ['./dev/templates/**/*.jade' ], [ 'templates', 'rev', 'compress', browserSync.reload ] )
    gulp.watch( ['./dev/styles/**/*.styl'    ], [ 'styles', 'styles:lint', 'compress'                ] )
    gulp.watch( ['./dev/scripts/js/**/*.js'  ], [ 'scripts', 'compress'                              ] )
})

gulp.task( 'default', () =>
  runSequence(
      'build'
    , 'serve'
    , 'watch'
  )
)
