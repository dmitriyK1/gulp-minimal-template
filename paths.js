module.exports = {

      dev   : './dev'
    , build : './build'

    , clean: [ 'build/**/*', 'reports/**/*' ]

    , copy: {
        src: 'dev/assets/**/*'
    }

    , critical: {
          src  : 'build/*.html'
    }

    , stylesLint: {
          src  : ['dev/styles/main.styl']
        , dest : 'reports/stylint'
    }

    , rev: {
        src: './build/*.html'
    }

    , scripts: {
          src     : './dev/scripts/index.js'
        , dest    : './build/js'
        , report  : './reports/eslint.html'
    }

    , styles: {
          src     : './dev/styles/main.styl'
        , dest    : './build/css'
    }

    , templates: {
        src: './dev/templates/pages/**/*.jade'
    }

    , watch: {
          templates : ['./dev/templates/**/*.jade' ]
        , styles    : ['./dev/styles/**/*.styl'    ]
        , scripts   : ['./dev/scripts/js/**/*.js'  ]
    }

    , doiuse: {
          src    : 'build/css/**/*.css'
        , report : 'reports/doiuse.txt'
    }

}
