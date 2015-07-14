var gulp = require('gulp');
var babel = require('gulp-babel');
var gutil = require('gulp-util');
var coffee = require('gulp-coffee');
var watch = require('gulp-watch');
var jade = require('gulp-jade');
var stylus = require('gulp-stylus');
var jshint = require('gulp-jshint');
var coffeelint = require('gulp-coffeelint');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var changed = require('gulp-changed');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');

gulp.task('coffee', function() {
	return gulp.src('./dev/coffee/**/*.coffee')
		.pipe( plumber(function() {
			console.log('COFFEE TASK FAILED!');
			this.emit('end');
		}) )
		.pipe( changed('./dist/js') )
		.pipe( coffeelint() )
		.pipe( coffeelint.reporter() )
		.pipe( sourcemaps.init() )
		.pipe( coffee({ bare: true }) )
		.pipe( sourcemaps.write('.') )
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('es6', function() {
	return gulp.src('./dev/es6/**/*.js')
		.pipe( plumber(function() {
			console.log('ES6 TASK FAILED!');
			this.emit('end');
		}) )
		.pipe( babel() )
		.pipe( jshint() )
		.pipe( jshint.reporter() )
		.pipe( gulp.dest('./dist/es6') );
});

gulp.task('js', function() {
	return gulp.src('./dev/js/**/*.js')
		.pipe( plumber(function() {
			console.log('JS TASK FAILED!');
			this.emit('end');
		}) )
		.pipe( jshint() )
		.pipe( jshint.reporter() )
		.pipe( gulp.dest('./dist/js') );
});

gulp.task('jade', function() {
	return gulp.src('./dev/jade/**/*.jade')
		.pipe( plumber(function() {
			console.log('JADE TASK FAILED!');
			this.emit('end');
		}) )
		.pipe( jade({ pretty: true }) )
		.pipe( gulp.dest('./dist/') );
});

gulp.task('stylus', function() {
	return gulp.src('./dev/stylus/**/*.styl')
		.pipe( plumber(function() {
			console.log('STYLUS TASK FAILED!');
			this.emit('end');
		}) )
		.pipe( stylus() )
		.pipe( autoprefixer() )
		.pipe( gulp.dest('./dist/css') );
});

gulp.task('clean', function() {
	return gulp.src('./dist').
		pipe( clean() );
});

gulp.task('build', function() {
	runSequence('clean'
		, ['coffee'
		, 'es6'
		, 'jade'
		, 'stylus'
		, 'js']	
	);
});

gulp.task('watch', function() {
	gulp.watch(['./dev/coffee/**/*.coffee'], ['coffee']);
	gulp.watch(['./dev/es6/**/*.js'], ['es6']);
	gulp.watch(['./dev/jade/**/*.jade'], ['jade']);
	gulp.watch(['./dev/stylus/**/*.styl'], ['stylus']);
	gulp.watch(['./dev/js/**/*.js'], ['js']);
});

gulp.task('default', function() {
	runSequence('build'
		, 'watch'
	);
});
