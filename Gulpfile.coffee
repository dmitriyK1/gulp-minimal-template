# // ================================================================================
# // HELPER FUNCTIONS
# // ================================================================================

log = (e) ->
    console.log([
        ''
        '----------ERROR MESSAGE START----------'
        'Error in plugin: ${e.plugin}'
        'Error type: ${e.name}'
        'Reason: ${e.message}'
        '----------ERROR MESSAGE END----------'
        ''
    ].join '\n')

    this.end()


isProduction    = require('gulp-util').env.p
gulp            = require 'gulp'
sass            = require 'gulp-sass'
babel           = require 'gulp-babel'
coffee          = require 'gulp-coffee'
jade            = require 'gulp-jade'
stylus          = require 'gulp-stylus'
jshint          = require 'gulp-jshint'
coffeelint      = require 'gulp-coffeelint'
autoprefixer    = require 'gulp-autoprefixer'
plumber         = require 'gulp-plumber'
changed         = require 'gulp-changed'
sourcemaps      = require 'gulp-sourcemaps'
runSequence     = require 'run-sequence'
clean           = require 'gulp-clean'
csscomb         = require 'gulp-csscomb'
jscs            = require 'gulp-jscs'
browserSync     = require 'browser-sync'
stylish         = require 'gulp-jscs-stylish'
uglify          = require 'gulp-uglify'
minify          = require 'gulp-htmlmin'
minifyInline    = require 'gulp-minify-inline'
prettify        = require 'gulp-prettify'
mmq             = require 'gulp-merge-media-queries'
csso            = require 'gulp-csso'
beautify        = require 'gulp-jsbeautifier'
stripDebug      = require 'gulp-strip-debug'
poststylus      = require 'poststylus'
cssnano         = require 'gulp-cssnano'
ngAnnotate      = require 'gulp-ng-annotate'
posthtml        = require 'gulp-posthtml'
posthtmlBemConfig =
        elemPrefix : '__'
        modPrefix  : '_'
        modDlmtr   : '--'

posthtmlPlugins = [
    require('posthtml-lorem')()
    require('posthtml-bem') posthtmlBemConfig
    require('posthtml-img-autosize')
        root             : './'
        processEmptySize : yes
]

gulp.task 'sass', () ->
    gulp
        .src './dev/sass/**/*.sass'
        .pipe plumber( log )
        .pipe sourcemaps.init()
        .pipe sass({ outputStyle: isProduction ? 'compressed' : undefined }).on 'error', sass.logError
        .pipe sourcemaps.write './dist/css'
        .pipe gulp.dest './dist/css'

gulp.task 'coffee', () =>
    gulp
        .src './dev/coffee/**/*.coffee'
        .pipe plumber log
        .pipe changed './dist/js', { extension: '.js' }
        .pipe coffeelint()
        .pipe coffeelint.reporter()
        .pipe sourcemaps.init()
        .pipe coffee { bare: yes }
        .pipe ngAnnotate()
        .pipe beautify { config: '.jsbeautifyrc' }
        .pipe jscs { fix: yes }
        .pipe jshint()
        .pipe jshint.reporter()
        .pipe stylish.combineWithHintResults()
        .pipe sourcemaps.write '.'
        .pipe gulp.dest './dist/js'


gulp.task 'jsx', () =>
    gulp
        .src './dev/jsx/**/*.jsx'
        .pipe plumber log
        .pipe changed './dist/js', { extension: '.js' }
        .pipe babel()
        .pipe ngAnnotate()
        .pipe beautify({ config: '.jsbeautifyrc' })
        .pipe jscs { fix: yes }
        .pipe jshint()
        .pipe jshint.reporter()
        .pipe stylish.combineWithHintResults()
        .pipe gulp.dest './dist/js'


gulp.task 'es6', () =>
    gulp
        .src './dev/es6/**/*.js'
        .pipe plumber log
        .pipe changed './dist/js', { extension: '.js' }
        .pipe babel()
        .pipe ngAnnotate()
        .pipe beautify { config: '.jsbeautifyrc' }
        .pipe jscs { fix: yes }
        .pipe jshint()
        .pipe jshint.reporter()
        .pipe stylish.combineWithHintResults()
        .pipe gulp.dest './dist/js'


gulp.task 'js', () =>
    gulp
        .src './dev/js/**/*.js'
        .pipe plumber log
        .pipe changed './dist/js', { extension: '.js' }
        .pipe ngAnnotate()
        .pipe beautify { config: '.jsbeautifyrc' }
        .pipe jscs { fix: yes }
        .pipe jshint()
        .pipe jshint.reporter()
        .pipe stylish.combineWithHintResults()
        .pipe gulp.dest './dist/js'

gulp.task 'jade', () =>
    gulp
        .src './dev/jade/**/*.jade'
        .pipe plumber log
        .pipe changed './dist', { extension: '.html' }
        .pipe jade { pretty: yes }
        .pipe posthtml posthtmlPlugins
        .pipe prettify
                brace_style       : 'expand'
                indent_size       : 1
                indent_char       : '\t'
                indent_with_tabs  : yes
                condense          : yes
                indent_inner_html : yes
                preserve_newlines : yes
        .pipe gulp.dest './dist'

gulp.task 'stylus', () =>
    gulp
        .src './dev/stylus/**/*.styl'
        .pipe plumber log
        .pipe changed './dist/css', { extension: '.css' }
        .pipe sourcemaps.init()
        .pipe stylus
            use: [
                poststylus
                    [
                        'rucksack-css'
                        'postcss-position'
                        'postcss-normalize'
                        'postcss-cssnext'
                        'postcss-remove-prefixes'
                        'postcss-flexboxfixer'
                        'postcss-gradientfixer'
                    ]
            ]
        .pipe csscomb()
        .pipe autoprefixer { browsers: ['last 2 versions'] }
        .pipe sourcemaps.write '.'
        .pipe gulp.dest './dist/css'

gulp.task 'clean', () =>
    gulp.src './dist'
        .pipe clean()

gulp.task 'browsersync', () =>
    browserSync.init ['dist/**/*'],
        server         : { baseDir: './dist' }
        logFileChanges : no
        open           : yes
        notify         : yes

gulp.task 'compress', () =>
    if isProduction is off then return

    gulp
        .src 'dist/js/*.js'
        .pipe plumber log
        .pipe stripDebug()
        .pipe uglify()
        .pipe gulp.dest 'dist/js'

    gulp
        .src 'dist/*.html'
        .pipe plumber log
        .pipe minify { collapseWhitespace: yes }
        .pipe minifyInline()
        .pipe gulp.dest 'dist'

    gulp
        .src 'dist/css/*.css'
        .pipe plumber log
        .pipe mmq()
        .pipe csso()
        .pipe cssnano()
        .pipe gulp.dest 'dist/css'

gulp.task 'build', () =>
    runSequence 'clean',
        [
            'coffee'
            'es6'
            'jade'
            'stylus'
            'sass'
            'js'
            'jsx'
        ]
        'compress'
        'browsersync'

gulp.task 'watch', () =>
    gulp.watch ['./dev/jsx/**/*.jsx'],
        [ 'jsx', 'compress' ]
    gulp.watch ['./dev/coffee/**/*.coffee'],
        [ 'coffee', 'compress' ]
    gulp.watch ['./dev/es6/**/*.js'],
        [ 'es6', 'compress' ]
    gulp.watch ['./dev/jade/**/*.jade'],
        [ 'jade', 'compress' ]
    gulp.watch ['./dev/stylus/**/*.styl'],
        [ 'stylus', 'compress' ]
    gulp.watch ['./dev/sass/**/*.sass'],
        [ 'sass', 'compress' ]
    gulp.watch ['./dev/js/**/*.js' ],
        [ 'js', 'compress' ]

gulp.task 'default', () => runSequence 'build' , 'watch'
