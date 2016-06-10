import nib         from 'nib'
import lost        from 'lost'
import rupture     from 'rupture'
import typeUtils   from 'stylus-type-utils'
import poststylus  from 'poststylus'
import browserSync from 'browser-sync'
const isDebug = process.env.NODE_ENV !== 'production'

gulp.task( 'styles', () =>
    gulp
        .src( paths.styles.src )
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.changed( paths.styles.dest, { extension: '.css' } ) )
        .pipe( plugins.sourcemaps.init() )
        .pipe( plugins.stylus({
            use: [
                  nib()
                , typeUtils()
                , poststylus([ 'lost', 'rucksack-css', 'postcss-position', 'postcss-normalize', 'postcss-cssnext', 'postcss-remove-prefixes', 'postcss-flexboxfixer', 'postcss-gradientfixer' ])
                , rupture()
                  // poststylus([ 'rucksack-css', 'postcss-autoreset', 'postcss-initial', 'postcss-position', 'postcss-normalize', 'postcss-cssnext' ])
            ]
            , 'include css': true
        }))
        .pipe( plugins.if(!isDebug, plugins.groupCssMediaQueries()) )
        .pipe( plugins.csscomb() )
        .pipe( plugins.autoprefixer() )
        .pipe( plugins.sourcemaps.write('.') )
        .pipe( gulp.dest( paths.styles.dest ) )
        .pipe( browserSync.stream({ match: '**/*.css' }) )
)
