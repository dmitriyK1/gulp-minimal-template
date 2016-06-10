import browserSync from 'browser-sync'

gulp.task( 'watch', () => {
    gulp.watch( paths.watch.templates, [ 'templates', 'rev', 'compress', browserSync.reload ] )
    gulp.watch( paths.watch.styles,    [ 'styles', 'styles:lint', 'compress'                ] )
    gulp.watch( paths.watch.scripts,   [ 'scripts', 'compress'                              ] )
})
