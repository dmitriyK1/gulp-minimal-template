gulp.task( 'watch', () => {
    gulp.watch( ['./dev/templates/**/*.jade' ], [ 'templates', 'rev', 'compress', browserSync.reload ] )
    gulp.watch( ['./dev/styles/**/*.styl'    ], [ 'styles', 'styles:lint', 'compress'                ] )
    gulp.watch( ['./dev/scripts/js/**/*.js'  ], [ 'scripts', 'compress'                              ] )
})

