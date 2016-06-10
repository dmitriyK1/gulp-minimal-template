gulp.task( 'build', () =>
    runSequence(
          [
              'clean'
            , 'copy'
            , 'scripts'
            , 'templates'
            , 'styles'
          ]
            , 'rev'
            , 'styles:lint'
            , 'compress'
    )
)

