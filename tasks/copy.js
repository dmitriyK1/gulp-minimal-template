gulp.task( 'copy', () =>
  gulp
    .src('dev/assets/**/*')
    .pipe( plugins.changed('build') )
    .pipe( gulp.dest('build') )
)

