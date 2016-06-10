import fs                 from 'fs'
import path               from 'path'
import eslintHtmlReporter from 'eslint-html-reporter'

gulp.task( 'scripts', () =>
    gulp
        .src('./dev/scripts/index.js')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.changed( './build/js', { extension: '.js' } ) )
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
        .pipe( plugins.eslint.format( eslintHtmlReporter, results => fs.writeFileSync(path.join(__dirname, '../reports/eslint.html'), results) ))
        .pipe( plugins.eslint.format() )
        .pipe( plugins.ngAnnotate() )
        .pipe( plugins.sourcemaps.write('.') )
        .pipe( gulp.dest('./build/js') )
)

