import critical from 'critical'

gulp.task( 'critical', () => critical.generate({
        inline : true
      , base   : paths.build
      , src    : paths.critical.src
      , dest   : paths.critical.dest
      , width  : 1300
      , height : 900
  })
)

