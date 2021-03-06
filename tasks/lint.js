// add here all linting tasks / combine with compilation

gulp.task('styles:lint', () => (
    gulp
        .src( paths.stylesLint.src )
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.stylint({
              config          : '.stylintrc'
            , reporter        : 'stylint-stylish'
            , reporterOptions : { verbose: true }
        }))
        .pipe( plugins.logCapture.start(process.stdout, 'write') )
        .pipe( plugins.stylint.reporter() )
        .pipe( plugins.logCapture.stop('xml') )
        .pipe( gulp.dest( paths.stylesLint.dest ) )
))
