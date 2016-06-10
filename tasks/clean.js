import del  from 'del'

gulp.task( 'clean', () => del.sync([ 'build/**/*', 'reports/**/*' ]) )

