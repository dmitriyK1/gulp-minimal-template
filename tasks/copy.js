gulp.task( 'copy', () =>
  gulp
    .src( paths.copy.src )
    .pipe( plugins.changed( paths.build ) )
    .pipe( gulp.dest( paths.build ) )
)
