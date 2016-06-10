gulp.task( 'iconfont', () =>
    gulp
        .src('dev/iconfont')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.iconfontCss, {
              path       : 'templates/iconfont.styl'
            , fontName   : 'iconfont'
            , targetPath : '../temp/stylus/iconfont.styl'
            , fontPath   : '../fonts/iconfont/'
        })
        .pipe( plugins.iconfont({
              fontName   : 'iconfont'
            , normalize  : true
            , fontHeight : 1001
        }))
        .pipe( gulp.dest('build/fonts') )
)
