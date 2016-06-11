gulp.task( 'rev', () =>
    gulp
        .src( paths.rev.src )
        .pipe( plugins.revAppend() )
        .pipe( gulp.dest(paths.build) )
)
