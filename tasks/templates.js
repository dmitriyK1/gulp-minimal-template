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
        .src('./dev/templates/pages/**/*.jade')
        .pipe( plugins.plumber( plugins.plumberLogger ) )
        .pipe( plugins.changed( './build', { extension: '.html' } ) )
        .pipe( plugins.jade({ pretty: true }) )
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
        .pipe( gulp.dest('./build') )
)
