// TODO: make browserSync reload on jade compilation

// TODO: add something from https://github.com/CSSSR/csssr-project-template

// TODO: split config into separate task files

// TODO: add webpack

// TODO: add sprites task

// TODO: Use gulp-if to conditionally load compression where needed
//
// add for css images inlining
// TODO: https://github.com/assetsjs/postcss-assets
//
// https://github.com/postcss/postcss-safe-parser

import fs                 from 'fs'
import path               from 'path'
import gulp               from 'gulp'
const plugins             = require('gulp-load-plugins')()
const isProduction        = plugins.util.env.p
import critical           from 'critical'
import runSequence        from 'run-sequence'
import del                from 'del'
import lost               from 'lost'
import rupture            from 'rupture'
import browserSync        from 'browser-sync'
import eslintHtmlReporter from 'eslint-html-reporter';
import poststylus         from 'poststylus'
const posthtmlBemConfig = {
        elemPrefix: '__',
        modPrefix: '_',
        modDlmtr: '--'
}
const posthtmlPlugins = [
      require('posthtml-lorem')()
    , require('posthtml-bem')( posthtmlBemConfig )
    , require('posthtml-img-autosize')({
          root: './'
        , processEmptySize: true
    })
]

// const postcss         = require('gulp-postcss')
// const postcssInitial  = require('postcss-initial')
// const postcssPosition = require('postcss-position')
// const postcssPlugins  = [
    // postcssInitial
    // , postcssPosition
// ]

gulp.task('lint-css', () =>
  gulp
    .src('./dist/css/**/*.css')
    .pipe( plugins.plumber( log ) )
    .pipe(
      plugins.stylelint({
            reportOutputDir : 'reports'
          , failAfterError  : false
          , reporters: [{
              formatter : 'verbose'
              , save      : 'stylelint.txt'
              , console   : false
          }]
      })
    )
)


// gulp.task( 'jsx', () =>
//     gulp
//         .src('./dev/scripts/jsx#<{(||)}>#*.jsx')
//         .pipe( plugins.plumber( log ) )
//         .pipe( plugins.changed( './dist/js', { extension: '.js' } ) )
//         .pipe( plugins.babel() )
//         .pipe( plugins.ngAnnotate() )
//         // .pipe( plugins.fixmyjs({ lookup: true }) )
//         .pipe( plugins.jsbeautifier({ config: '.jsbeautifyrc' }) )
//         .pipe( plugins.jshint('./.jshintrc') )
//         .pipe( plugins.jscs({ fix: true }) )
//         .pipe( plugins.jscsStylish.combineWithHintResults() )
//         .pipe( plugins.jshint.reporter('jshint-stylish') )
//         .pipe( plugins.eslint({ fix: true }) )
//         .pipe( plugins.eslint.format() )
//         .pipe( gulp.dest('./dist/js') )
// )

gulp.task( 'scripts', () =>
    gulp
        .src('./dev/scripts/js/init.js')
        .pipe( plugins.plumber( log ) )
        .pipe( plugins.changed( './dist/js', { extension: '.js' } ) )
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
        .pipe( plugins.eslint.format( eslintHtmlReporter, results => fs.writeFileSync(path.join(__dirname, 'reports/eslint.html'), results) ) )
        .pipe( plugins.eslint.format() )
        .pipe( plugins.jshint('./.jshintrc') )
        .pipe( plugins.jscsStylish.combineWithHintResults() )
        .pipe( plugins.jshint.reporter('gulp-jshint-file-reporter'))
        .pipe( plugins.jshint.reporter('jshint-stylish') )
        .pipe( plugins.ngAnnotate() )
        .pipe( plugins.sourcemaps.write('.') )
        .pipe( gulp.dest('./dist/js') )
)

gulp.task( 'templates', () =>
    gulp
        .src('./dev/templates/pages/**/*.jade')
        .pipe( plugins.plumber( log ) )
        .pipe( plugins.changed( './dist', { extension: '.html' } ) )
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
        .pipe( gulp.dest('./dist') )
)

gulp.task('rev', () =>
    gulp
    .src('./dist/*.html')
    .pipe( plugins.revAppend() )
    .pipe( gulp.dest('./dist/') )
)

gulp.task( 'styles', () =>
    gulp
        .src('./dev/styles/main.styl')
        .pipe( plugins.plumber( log ) )
        .pipe( plugins.changed( './dist/css', { extension: '.css' } ) )
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.stylus({
            use: [
                // poststylus([ 'rucksack-css', 'postcss-autoreset', 'postcss-initial', 'postcss-position', 'postcss-normalize', 'postcss-cssnext' ])
                  rupture()
                , poststylus([ 'lost', 'rucksack-css', 'postcss-position', 'postcss-normalize', 'postcss-cssnext', 'postcss-remove-prefixes', 'postcss-flexboxfixer', 'postcss-gradientfixer' ])
            ]
        }))
        // .pipe( postcss(postcssPlugins) )
        .pipe( plugins.csscomb() )
        .pipe( plugins.autoprefixer({ browsers: ['last 2 versions'] }) )
        .pipe( plugins.sourcemaps.write('.') )
        .pipe( gulp.dest('./dist/css') )
)

gulp.task( 'clean', () => del.sync('dist/**/*') )

gulp.task('serve', () =>
    browserSync.init(
              ['dist/**/*']
            , {
                  server          : { baseDir: './dist' }
                , reloadOnRestart : true
                , open            : true
                , notify          : true
              }
    )
)

gulp.task( 'compress', () => {
    if( !isProduction ) return

    gulp
        .src('dist/js/*.js')
        .pipe( plugins.plumber( log ) )
        .pipe( plugins.stripDebug() )
        .pipe( plugins.uglify({ mangle: true }) )
        .pipe( gulp.dest('dist/js') )

    gulp
        .src('dist/*.html')
        .pipe( plugins.plumber( log ) )
        .pipe( plugins.htmlmin({ collapseWhitespace: true }) )
        .pipe( plugins.minifyInline() )
        .pipe( gulp.dest('dist') )

    gulp
        .src('dist/css/*.css')
        .pipe( plugins.plumber( log ) )
        .pipe( plugins.mergeMediaQueries() )
        .pipe( plugins.csso() )
        .pipe( plugins.cssnano({
                discardComments: { removeAll: true }
            })
        )
        .pipe( gulp.dest('dist/css') )
})

gulp.task( 'critical', () => critical.generate({
      inline : true,
      base   : 'dist/',
      src    : 'index.html',
      dest   : 'dist/index-critical.html',
      width  : 1300,
      height : 900
  })
)

gulp.task( 'copy', () =>
  gulp
    .src('dev/resources/**/*')
    .pipe( plugins.changed('dist') )
    .pipe( gulp.dest('dist') )
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
            // , 'jsx'
          ]
            , 'rev'
            , 'lint-css'
            , 'compress'
    )
)

gulp.task( 'watch', () => {
    gulp.watch( ['./dev/templates/**/*.jade'     ], [ 'templates', 'rev', 'compress'   ] )
    gulp.watch( ['./dev/styles/**/*.styl'   ], [ 'styles', 'compress', 'lint-css' ] )
    gulp.watch( ['./dev/scripts/js/**/*.js' ], [ 'scripts', 'compress'            ] )
    // gulp.watch( ['./dev/jsx#<{(||)}>#*.jsx'      ], [ 'jsx', 'compress'                ] )
})

gulp.task( 'default', () =>
  runSequence(
      'build'
    , 'serve'
    , 'watch'
  )
)

// ================================================================================
// HELPER FUNCTIONS
// ================================================================================

function log( e ) {
    console.log([
        ''
        , '----------ERROR MESSAGE START----------'
        , `Error in plugin: ${e.plugin}`,
        , `Error type: ${e.name}`
        , `Reason: ${e.message}`
        , '----------ERROR MESSAGE END----------'
        ,''
    ].join('\n'))

    this.end()
}
