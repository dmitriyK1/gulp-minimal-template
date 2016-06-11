import fs     from 'fs'
import doiuse from 'doiuse'

try {
    fs.unlinkSync( paths.doiuse.report )
} catch( error ) {}

gulp.task( 'doiuse', () =>

    gulp
        .src( paths.doiuse.src )
        .pipe(
            plugins.postcss([
                doiuse({
                    browsers: [
                        'last 2 versions'
                    ],
                    onFeatureUsage(usageInfo) {
                        fs.appendFileSync( paths.doiuse.report, usageInfo.message )
                        fs.appendFileSync( paths.doiuse.report, '\r\n' )
                    }
                })
            ])
        )
)
