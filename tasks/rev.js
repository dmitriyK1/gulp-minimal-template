gulp.task('rev', () =>
    gulp
    .src('./build/*.html')
    .pipe( plugins.revAppend() )
    .pipe( gulp.dest('./build/') )
)

