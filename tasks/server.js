import browserSync from 'browser-sync'

gulp.task('serve', () =>
    browserSync.init({
          server          : { baseDir: 'build' }
        , reloadOnRestart : true
        , open            : true
        , notify          : false
        , logFileChanges  : false
        , watchOptions    : { ignored: '*.map' }
    })
)

