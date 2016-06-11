gulp.task( 'deploy:github', () =>
	gulp
	    .src([ 'build/**/*' ])
	    .pipe( plugins.ghPages({ branch: 'gh-pages' }) )
)

gulp.task( 'deploy:surge', () =>
    plugins.surge({
          project: './build'
	, domain: 'dimaroxx.surge.sh'
    })
)
