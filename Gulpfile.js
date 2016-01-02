//
// TODO: Use gulp-if to conditionally load compression where needed
//
// TODO: Make es6 sourcemaps work

function log( e ) {
    console.log([
        '',
        '----------ERROR MESSAGE START----------',
        `Error in plugin: ${e.plugin}`,
        `Error type: ${e.name}`,
        `Reason: ${e.message}`,
        '----------ERROR MESSAGE END----------',
        ''
    ].join('\n'));

    this.end();
}

const gulp         = require('gulp')
const sass         = require('gulp-sass')
const babel        = require('gulp-babel')
const gutil        = require('gulp-util')
const coffee       = require('gulp-coffee')
const jade         = require('gulp-jade')
const stylus       = require('gulp-stylus')
const jshint       = require('gulp-jshint')
const coffeelint   = require('gulp-coffeelint')
const autoprefixer = require('gulp-autoprefixer')
const plumber      = require('gulp-plumber')
const changed      = require('gulp-changed')
const sourcemaps   = require('gulp-sourcemaps')
const runSequence  = require('run-sequence')
const clean        = require('gulp-clean')
const csscomb      = require('gulp-csscomb')
const jscs         = require('gulp-jscs')
const browserSync  = require('browser-sync')
const stylish      = require('gulp-jscs-stylish')
const uglify       = require('gulp-uglify')
const minify       = require('gulp-htmlmin')
const minifyInline = require('gulp-minify-inline')
const prettify     = require('gulp-prettify')
const mmq          = require('gulp-merge-media-queries')
const csso         = require('gulp-csso')
const beautify     = require('gulp-jsbeautifier')
const stripDebug   = require('gulp-strip-debug')
const isProduction = gutil.env.p

gulp.task( 'sass', () =>
    gulp
        .src('./dev/sass/**/*.sass')
        .pipe( plumber( log ) )
        .pipe( sourcemaps.init() )
        .pipe( sass({ outputStyle: isProduction ? 'compressed' : undefined }).on( 'error', sass.logError ) )
        .pipe( sourcemaps.write('./dist/css') )
        .pipe( gulp.dest('./dist/css') )
)

gulp.task( 'coffee', () =>
    gulp
        .src('./dev/coffee/**/*.coffee')
        .pipe( plumber( log ) )
        .pipe( changed( './dist/js', { extension: '.js' } ) )
        .pipe( coffeelint() )
        .pipe( coffeelint.reporter() )
        .pipe( sourcemaps.init() )
        .pipe( coffee({ bare: true }) )
        .pipe( beautify({ config: '.jsbeautifyrc' }) )
        .pipe( jscs({ fix: true }) )
        .pipe( jshint() )
        .pipe( jshint.reporter() )
        .pipe( stylish.combineWithHintResults() )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('./dist/js') )
)

gulp.task( 'jsx', () =>
    gulp
        .src('./dev/jsx/**/*.jsx')
        .pipe( plumber( log ) )
        .pipe( changed( './dist/js', { extension: '.js' } ) )
        .pipe( babel() )
        .pipe( beautify({ config: '.jsbeautifyrc' }) )
        .pipe( jscs({ fix: true }) )
        .pipe( jshint() )
        .pipe( jshint.reporter() )
        .pipe( stylish.combineWithHintResults() )
        .pipe( gulp.dest('./dist/js') )
)

gulp.task( 'es6', () =>
    gulp
        .src('./dev/es6/**/*.js')
        .pipe( plumber( log ) )
        .pipe( changed( './dist/js', { extension: '.js' } ) )
        .pipe( babel() )
        .pipe( beautify({ config: '.jsbeautifyrc' }) )
        .pipe( jscs({ fix: true }) )
        .pipe( jshint() )
        .pipe( jshint.reporter() )
        .pipe( stylish.combineWithHintResults() )
        .pipe( gulp.dest('./dist/js') )
)

gulp.task( 'js', () =>
    gulp
        .src('./dev/js/**/*.js')
        .pipe( plumber( log ) )
        .pipe( changed( './dist/js', { extension: '.js' } ) )
        .pipe( beautify({ config: '.jsbeautifyrc' }) )
        .pipe( jscs({ fix: true }) )
        .pipe( jshint() )
        .pipe( jshint.reporter() )
        .pipe( stylish.combineWithHintResults() )
        .pipe( gulp.dest('./dist/js') )
)

gulp.task( 'jade', () =>
    gulp
        .src('./dev/jade/**/*.jade')
        .pipe( plumber( log ) )
        .pipe( changed( './dist', { extension: '.html' } ) )
        .pipe( jade({ pretty: true }) )
        .pipe(
            prettify({
                  brace_style: 'expand'
                , indent_size: 1
                , indent_char: '\t'
                , indent_with_tabs: true
                , condense: true
                , indent_inner_html: true
                , preserve_newlines: true
            })
        )
        .pipe( gulp.dest('./dist') )
)

gulp.task( 'stylus', () =>
    gulp
        .src('./dev/stylus/**/*.styl')
        .pipe( plumber( log ) )
        .pipe( changed( './dist/css', { extension: '.css' } ) )
        .pipe( sourcemaps.init() )
        .pipe( stylus() )
        .pipe( csscomb() )
        .pipe( autoprefixer() )
        .pipe( sourcemaps.write('.') )
        .pipe( gulp.dest('./dist/css') )
)

gulp.task( 'clean', () => gulp.src('./dist').pipe( clean() ) )

gulp.task('browsersync', () =>
    browserSync.init(
              ['dist/**/*']
            , { server: { baseDir: './dist' }
            , logFileChanges: false
            , open: true
            , notify: true
        }
    )
)

gulp.task( 'compress', () => {
    if( !isProduction ) return

    gulp
        .src('dist/js/*.js')
        .pipe( plumber( log ) )
        .pipe( stripDebug() )
        .pipe( uglify() )
        .pipe( gulp.dest('dist/js') )

    gulp
        .src('dist/*.html')
        .pipe( plumber( log ) )
        .pipe( minify({ collapseWhitespace: true }) )
        .pipe( minifyInline() )
        .pipe( gulp.dest('dist') )

    gulp
        .src('dist/css/*.css')
        .pipe( plumber( log ) )
        .pipe( mmq() )
        .pipe( csso() )
        .pipe( gulp.dest('dist/css') )
})

gulp.task( 'build', () =>
    runSequence(
          'clean'
        , ['coffee'
        , 'es6'
        , 'jade'
        , 'stylus'
        , 'sass'
        , 'js'
        , 'jsx']
        , 'compress'
        , 'browsersync'
    )
)

gulp.task( 'watch', () => {
    gulp.watch( ['./dev/jsx/**/*.jsx'], [ 'jsx', 'compress' ] )
    gulp.watch( ['./dev/coffee/**/*.coffee'], [ 'coffee', 'compress' ] )
    gulp.watch( ['./dev/es6/**/*.js'], [ 'es6', 'compress' ] )
    gulp.watch( ['./dev/jade/**/*.jade'], [ 'jade', 'compress' ] )
    gulp.watch( ['./dev/stylus/**/*.styl'], [ 'stylus', 'compress' ] )
    gulp.watch( ['./dev/sass/**/*.sass'], [ 'sass', 'compress' ] )
    gulp.watch( ['./dev/js/**/*.js' ], [ 'js', 'compress' ] )
})

gulp.task( 'default', () => runSequence( 'build' , 'watch' ) )
