const gulp         = require('gulp')
const babel        = require('gulp-babel')
const gutil        = require('gulp-util')
const coffee       = require('gulp-coffee')
const watch        = require('gulp-watch')
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
const stylish      = require('gulp-jscs-stylish');

gulp.task('coffee', () =>
	gulp
		.src('./dev/coffee/**/*.coffee')
		.pipe( plumber(function() {
			console.log('COFFEE TASK FAILED!')
			this.emit('end');
		}) )
		.pipe( changed('./dist/js') )
		.pipe( coffeelint() )
		.pipe( coffeelint.reporter() )
		.pipe( sourcemaps.init() )
		.pipe( coffee({ bare: true }) )
		.pipe( jscs({ fix: true }) )
        .pipe( jshint() )
        .pipe( jshint.reporter() )
        .pipe( stylish.combineWithHintResults() )
		.pipe( sourcemaps.write('.') )
		.pipe( gulp.dest('./dist/js') )
)

gulp.task('es6', () =>
	gulp
		.src('./dev/es6/**/*.js')
		.pipe( plumber(function() {
			console.log('ES6 TASK FAILED!')
			this.emit('end')
		}) )
		.pipe( babel() )
		.pipe( jscs({ fix: true }) )
        .pipe( jshint() )
        .pipe( jshint.reporter() )
        .pipe( stylish.combineWithHintResults() )
		.pipe( gulp.dest('./dist/es6') )
)

gulp.task('js', () =>
	gulp
		.src('./dev/js/**/*.js')
		.pipe( plumber(function() {
			console.log('JS TASK FAILED!')
			this.emit('end')
		}) )
		.pipe( jscs({ fix: true }) )
        .pipe( jshint() )
        .pipe( jshint.reporter() )
        .pipe( stylish.combineWithHintResults() )
		.pipe( gulp.dest('./dist/js') )
)

gulp.task('jade', () =>
	gulp
		.src('./dev/jade/**/*.jade')
		.pipe( plumber(function() {
			console.log('JADE TASK FAILED!')
			this.emit('end')
		}) )
		.pipe( jade({ pretty: true }) )
		.pipe( gulp.dest('./dist/') )
)

gulp.task('stylus', () =>
    gulp
		.src('./dev/stylus/**/*.styl')
		.pipe( plumber(function() {
			console.log('STYLUS TASK FAILED!')
			this.emit('end')
		}) )
		.pipe( stylus() )
		.pipe( autoprefixer() )
		.pipe( csscomb() )
		.pipe( gulp.dest('./dist/css') )
)

gulp.task('clean', () => gulp.src('./dist').pipe( clean() ) )

gulp.task('browsersync', () =>
    browserSync.init( ['dist/**/*']
        , { server: { baseDir: './dist' }
            , logFileChanges: false
            , open: true
            , notify: true
        }
    )
)

gulp.task('build', () =>
	runSequence('clean'
		, ['coffee'
		, 'es6'
		, 'jade'
		, 'stylus'
		, 'js'
		, 'browsersync']
	)
)

gulp.task('watch', () => {
	gulp.watch( ['./dev/coffee/**/*.coffee'], ['coffee'] )
	gulp.watch( ['./dev/es6/**/*.js'], ['es6'] )
	gulp.watch( ['./dev/jade/**/*.jade'], ['jade'] )
	gulp.watch( ['./dev/stylus/**/*.styl'], ['stylus'] )
	gulp.watch( ['./dev/js/**/*.js'], ['js'] )
})

gulp.task('default', () => runSequence( 'build' , 'watch') )
