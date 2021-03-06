var gulp = require('gulp'),
    lr = require('gulp-livereload'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    htmlreplace = require('gulp-html-replace'),
    htmlify = require('gulp-angular-htmlify'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer');

// Necesario para versiones antiguas de Node
require('es6-promise').polyfill();

var port = 80;

var paths = {
    app: 'app',
    lib: 'app/lib',
    scss: 'sass',
    css: 'app/css',
    target: 'dist'
};

var names = {
    anyFile: '/**/*',
    anyJS: '/**/*.js',
    anyHTML: '/**/*.html',
    anyCSS: '/**/*.css',
    anySCSS: '/**/*.scss',
    minJS: 'app.min.js',
    minCSS: 'app.min.css'
};


function startExpress(environment) {
    console.log('Levantando servidor en modo: ' + environment);
    var express = require('express');
    var app = express();
    // DEV: Con librerias sin minificar, con mocks y con livereload
    // TEST: Librerias minificadas, con mocks y sin livereload
    // ELSE: Librerias minificadas, sin mocks y sin livereload
    if (environment === 'dev') {
        app.use(require('connect-livereload')());
        app.use(express.static(__dirname + '/' + paths.app));

        app.get('/api/:fichero', function (req, res) {
            res.sendFile(req.params.fichero + '.json', {root: './mocks'});
        });
        app.all('/*', function(req, res) {
            res.sendfile(__dirname + '/' + paths.app + '/index.html');
        });

        // Start livereload
        lr.listen(35729);
    } else if (environment === 'test') {
        app.use(express.static(__dirname + '/' + paths.target));
        app.get('/api/:fichero', function (req, res) {
            res.sendFile(req.params.fichero + '.json', {root: './mocks'});
        });
    } else {
        app.use(express.static(__dirname + '/' + paths.target));
    }
    app.listen(port);
}

function notifyLivereload(file) {
    lr.reload(file);
}

gulp.task('compileCSS', function () {
    console.log('Actualizando CSSs');
    return gulp.src([paths.scss + '/reset.scss', paths.scss + names.anySCSS])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(paths.css));
});

gulp.task('validate', function () {
    return gulp.src([paths.app + names.anyJS])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

gulp.task('copy', function () {
    return gulp.src([
        paths.app + names.anyFile,
        '!' + paths.app + names.anyJS,
        '!' + paths.app + names.anyCSS,
        '!' + paths.app + names.anyHTML,
        '!' + paths.css,
        '!' + paths.lib
    ])
        .pipe(gulp.dest(paths.target));
});

gulp.task('minifyJS_fuentes', function () {
    // Minificamos todos los JS de la aplicacion
    // ToDo: si se desea especificar un orden de empaquetado de JS ira aqui, sino sera alfabetico
    return gulp.src([
        paths.lib + '/angular.js',
        paths.lib + '/angular-translate.js',
        paths.lib + names.anyJS,
        paths.app + '/app.js',
        paths.app + '/config.js',
        paths.app + '/service.js',
        paths.app + '/**/*.js'
    ])
        .pipe(concat(names.minJS))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(gulp.dest(paths.target));
});

gulp.task('minifyJS', ['minifyJS_fuentes'], function () {
    // Reemplazamos en el index la referencia de todos los JS al minificado
    return gulp.src(paths.target + '/index.html')
        .pipe(htmlreplace({
            'JS': [names.minJS]
        }, {'keepUnassigned': true, 'keepBlockTags': true}))
        .pipe(gulp.dest(paths.target));
});

gulp.task('minifyCSS_fuentes', function () {
    // Minificamos todos los CSS de la aplicacion
    // ToDo: si se desea especificar un orden de empaquetado de CSS ira aqui, sino sera alfabetico
    return gulp.src([
        paths.css + '/reset.css',
        paths.lib + names.anyCSS,
        paths.css + names.anyCSS])
        .pipe(concat(names.minCSS))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest(paths.target));
});

gulp.task('minifyCSS', ['minifyCSS_fuentes'], function () {
    // Reemplazamos en el index la referencia de todos los CSS al minificado
    return gulp.src(paths.target + '/index.html')
        .pipe(htmlreplace({
            'CSS': [names.minCSS]
        }, {'keepUnassigned': true, 'keepBlockTags': true}))
        .pipe(gulp.dest(paths.target));
});

// Debe lanzarse antes que las tareas de minificados
gulp.task('htmlify', function () {
    return gulp.src([paths.app + names.anyHTML])
        .pipe(htmlify())
        .pipe(gulp.dest(paths.target));
});

// Construye el empaquetado
gulp.task('build', ['compileCSS', 'copy', 'htmlify', 'minifyJS', 'minifyCSS']);

// Levanta el servidor en modo test
gulp.task('startDev', ['compileCSS'], function () {
    startExpress('dev');
    gulp.watch(paths.scss + names.anyFile, ['compileCSS']);
    gulp.watch(paths.app + names.anyFile, notifyLivereload);
});

// Levanta el servidor en modo test
gulp.task('startTest', ['build'], function () {
    startExpress('test');
});

// Levanta el servidor en modo test
gulp.task('startPro', ['build'], function () {
    startExpress('pro');
});

gulp.task('default', ['startDev']);
