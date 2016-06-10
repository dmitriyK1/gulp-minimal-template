import fs                 from 'fs'
import path               from 'path'
import eslintHtmlReporter from 'eslint-html-reporter'

gulp.task( 'scripts', () =>
    gulp
        .src( paths.scripts.src )
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.changed( paths.scripts.dest, { extension: '.js' } ) )
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.babel() )
        .pipe(plugins.fixmyjs({
            lookup   : true,
            curly    : true,
            es3      : true,
            nonew    : true,
            multivar : true,
            debug    : false
        }))
        .pipe( plugins.jsbeautifier({ config: '.jsbeautifyrc' }) )
        .pipe( plugins.jscs({ fix: true }) )
        .pipe( plugins.eslint({ fix: true }) )
        .pipe( plugins.eslint.format( eslintHtmlReporter, results => fs.writeFileSync( paths.scripts.report, results )))
        .pipe( plugins.eslint.format() )
        .pipe( plugins.ngAnnotate() )
        .pipe( plugins.sourcemaps.write('.') )
        .pipe( gulp.dest( paths.scripts.dest ) )
)

