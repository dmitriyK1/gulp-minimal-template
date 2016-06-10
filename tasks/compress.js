const isProduction        = plugins.util.env.p

gulp.task( 'compress', () => {
    if( !isProduction ) return

    gulp
        .src('build/js/*.js')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.stripDebug() )
        .pipe( plugins.uglify({ mangle: true }) )
        .pipe( gulp.dest('build/js') )

    gulp
        .src('build/*.html')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.htmlmin({ collapseWhitespace: true }) )
        .pipe( plugins.minifyInline() )
        .pipe( gulp.dest('build') )

    gulp
        .src('build/css/*.css')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.mergeMediaQueries() )
        .pipe( plugins.csso() )
        .pipe( plugins.cssnano({
                discardComments: { removeAll: true }
            })
        )
        .pipe( gulp.dest('build/css') )
})

