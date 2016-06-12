import critical from 'critical'

gulp.task( 'critical', () =>
  gulp
    .src( paths.critical.src )
    .pipe( critical.stream({
          base   : paths.build
        , inline : true
        , minify : true
        , width  : 1300
        , height : 900
    }))
    .pipe( gulp.dest(paths.build) )
)
