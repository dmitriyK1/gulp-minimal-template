const posthtmlBemConfig = {
        elemPrefix: '__'
      , modPrefix: '--'
      , modDlmtr: '_'
}

const posthtmlPlugins = [
      require('posthtml-lorem')()
    , require('posthtml-bem-sugar')()
    , require('posthtml-bem')( posthtmlBemConfig )
]

gulp.task( 'templates', () =>
    gulp
        .src( paths.templates.src )
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.changed( paths.build, { extension: '.html' } ) )
        .pipe( plugins.jade({ basedir: process.cwd(), pretty: true }) )
        .pipe( plugins.posthtml( posthtmlPlugins ) )
        .pipe(
            plugins.prettify({
                  brace_style       : 'expand'
                , indent_size       : 1
                , indent_char       : '\t'
                , indent_with_tabs  : true
                , condense          : true
                , indent_inner_html : true
                , preserve_newlines : true
            })
        )
        .pipe( gulp.dest(paths.build) )
)
