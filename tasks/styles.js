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
                , rupture()
                , poststylus([
                      'lost'
                    , 'rucksack-css'
                    , 'postcss-position'
                    , 'postcss-normalize'
                    , 'stylehacks'
                    , 'postcss-unprefix'
                    , 'postcss-flexboxfixer'
                    , 'postcss-gradientfixer'
                    , 'postcss-remove-prefixes'
                    , 'postcss-cssnext'
                    , 'postcss-discard-duplicates'
                    // , 'postcss-autoreset'
                ])
            ]
            , 'include css': true
        }))
        .pipe( plugins.if(!isDebug, plugins.groupCssMediaQueries()) )
        .pipe( plugins.csscomb() )
        .pipe( plugins.sourcemaps.write('.') )
        .pipe( gulp.dest( paths.styles.dest ) )
        .pipe( browserSync.stream({ match: '**/*.css' }) )
)
