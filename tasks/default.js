gulp.task( 'default', () =>
  runSequence(
      'build'
    , 'serve'
    , 'watch'
  )
)

