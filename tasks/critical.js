gulp.task( 'critical', () => critical.generate({
        inline : true
      , base   : 'build/'
      , src    : 'index.html'
      , dest   : 'build/index-critical.html'
      , width  : 1300
      , height : 900
  })
)

