//
// TODO: Use gulp-if to conditionally load compression where needed
//
// TODO: Make es6 sourcemaps work
//
// add for css images inlining
// TODO: https://github.com/assetsjs/postcss-assets
//
// https://github.com/postcss/postcss-safe-parser

const gulp              = require('gulp')
const plugins           = require('gulp-load-plugins')()
const isProduction      = plugins.util.env.p
const critical          = require('critical')
const runSequence       = require('run-sequence')
const del               = require('del')
const lost              = require('lost')
const browserSync       = require('browser-sync')
const poststylus        = require('poststylus')
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

gulp.task('lint-css', () => {
  gulp
    .src('./dist/css/**/*.css')
    .pipe( plugins.plumber( log ) )
    .pipe(plugins.stylelint({
      reporters: [
        { formatter: 'string', console: true }
      ]
    }))
})


gulp.task( 'jsx', () =>
    gulp
        .src('./dev/jsx/**/*.jsx')
        .pipe( plugins.plumber( log ) )
        .pipe( plugins.changed( './dist/js', { extension: '.js' } ) )
        .pipe( plugins.babel() )
        .pipe( plugins.ngAnnotate() )
        // .pipe( plugins.fixmyjs({ lookup: true }) )
        .pipe( plugins.jsbeautifier({ config: '.jsbeautifyrc' }) )
        .pipe( plugins.jshint('./.jshintrc') )
        .pipe( plugins.jscs({ fix: true }) )
        .pipe( plugins.jscsStylish.combineWithHintResults() )
        .pipe( plugins.jshint.reporter('jshint-stylish') )
        .pipe( plugins.eslint({ fix: true }) )
        .pipe( plugins.eslint.format() )
        .pipe( gulp.dest('./dist/js') )
)

gulp.task( 'es6', () =>
    gulp
        .src('./dev/es6/**/*.js')
        .pipe( plugins.plumber( log ) )
        .pipe( plugins.changed( './dist/js', { extension: '.js' } ) )
        .pipe( plugins.babel() )
        .pipe( plugins.ngAnnotate() )
        // .pipe( plugins.fixmyjs({ lookup: true }) )
        .pipe( plugins.jsbeautifier({ config: '.jsbeautifyrc' }) )
        .pipe( plugins.jshint('./.jshintrc') )
        .pipe( plugins.jscs({ fix: true }) )
        .pipe( plugins.jscsStylish.combineWithHintResults() )
        .pipe( plugins.jshint.reporter('jshint-stylish') )
        .pipe( plugins.eslint({ fix: true }) )
        .pipe( plugins.eslint.format() )
        .pipe( gulp.dest('./dist/js') )
)

gulp.task( 'js', () =>
    gulp
        .src('./dev/js/**/*.js')
        .pipe( plugins.plumber( log ) )
        .pipe( plugins.changed( './dist/js', { extension: '.js' } ) )
        .pipe( plugins.ngAnnotate() )
        // .pipe( plugins.fixmyjs({ lookup: true }) )
        .pipe( plugins.jsbeautifier({ config: '.jsbeautifyrc' }) )
        .pipe( plugins.jshint('./.jshintrc') )
        .pipe( plugins.jscs({ fix: true }) )
        .pipe( plugins.jscsStylish.combineWithHintResults() )
        .pipe( plugins.jshint.reporter('jshint-stylish') )
        .pipe( plugins.eslint({ fix: true }) )
        .pipe( plugins.eslint.format() )
        .pipe( gulp.dest('./dist/js') )
)

gulp.task( 'jade', () =>
    gulp
        .src('./dev/jade/**/*.jade')
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

gulp.task( 'stylus', () =>
    gulp
        .src('./dev/stylus/**/*.styl')
        .pipe( plugins.plumber( log ) )
        .pipe( plugins.changed( './dist/css', { extension: '.css' } ) )
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.stylus({
            use: [
                // poststylus([ 'rucksack-css', 'postcss-autoreset', 'postcss-initial', 'postcss-position', 'postcss-normalize', 'postcss-cssnext' ])
                poststylus([ 'lost', 'rucksack-css', 'postcss-position', 'postcss-normalize', 'postcss-cssnext', 'postcss-remove-prefixes', 'postcss-flexboxfixer', 'postcss-gradientfixer' ])
            ]
        }))
        // .pipe( postcss(postcssPlugins) )
        .pipe( plugins.csscomb() )
        .pipe( plugins.autoprefixer({ browsers: ['last 2 versions'] }) )
        .pipe( plugins.sourcemaps.write('.') )
        .pipe( gulp.dest('./dist/css') )
)

gulp.task( 'clean', () => del('dist/**/*') )

gulp.task('serve', () =>
    browserSync.init(
              ['dist/**/*']
            , {
                  server         : { baseDir: './dist' }
                , logFileChanges : false
                , open           : true
                , notify         : true
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

gulp.task( 'help', plugins.taskListing )

gulp.task( 'build', () =>
    runSequence(
        [
              'clean'
            , 'es6'
            , 'jade'
            , 'stylus'
            , 'js'
            // , 'jsx'
        ]
        , 'rev'
        , 'compress'
        , 'lint-css'
    )
)

gulp.task( 'watch', () => {
    // gulp.watch( ['./dev/jsx#<{(||)}>#*.jsx'      ], [ 'jsx', 'compress'                ] )
    gulp.watch( ['./dev/es6/**/*.js'       ], [ 'es6', 'compress'                ] )
    gulp.watch( ['./dev/jade/**/*.jade'    ], [ 'jade', 'rev', 'compress'        ] )
    gulp.watch( ['./dev/stylus/**/*.styl'  ], [ 'stylus', 'compress', 'lint-css' ] )
    gulp.watch( ['./dev/js/**/*.js'        ], [ 'js', 'compress'                 ] )
})

gulp.task( 'default', () => runSequence( ['build' ,'serve', 'watch'] ) )

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
