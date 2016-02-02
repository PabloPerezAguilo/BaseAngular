var gulp = require('gulp');
var lr = require('gulp-livereload');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var htmlreplace = require('gulp-html-replace');
var htmlify = require('gulp-angular-htmlify');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');

var paths = {
	app : "app",
	lib : "lib",
	scss : "sass",
	css : "app/css",
	target : "target"
};

var names = {
	anyFile : "/**/*",
	anyJS : "/**/*.js",
	anyHTML : "/**/*.html",
	anyCSS : "/**/*.css",
	anySCSS : "/**/*.scss",
}


function startExpress(enviroment) {
	var express = require('express');
	var app = express();
	// DEV: Con librerias sin minificar, con mocks y con livereload
	// TEST: Librerias minificadas, con mocks y sin livereload
	// ELSE: Librerias minificadas, sin mocks y sin livereload
	if(enviroment === "dev") {
		app.use(require('connect-livereload')());
		app.use(express.static(__dirname + "/"+paths.app));
		app.use(express.static(__dirname + "/"+paths.lib));

		app.get("/api/:fichero", function(req, res) {
			res.sendFile(req.params.fichero+".json", {root: './mocks'});
		});

		// Start livereload
		lr.listen(35729);
	} else if(enviroment === "test") {
		app.use(express.static(__dirname + "/"+paths.target));
		app.get("/api/:fichero", function(req, res) {
			res.sendFile(req.params.fichero+".json", {root: './mocks'});
		});
	} else {
		app.use(express.static(__dirname + "/"+paths.target));
	}
	app.listen(80);
}

function notifyLivereload(file) {
	lr.reload(file);
}

gulp.task('compileCSS', function () {
	console.log("Actualizando CSSs");
	return gulp.src([paths.scss+'/reset.scss',paths.scss+names.anySCSS])
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest(paths.css));
});

gulp.task('validate', function () {
	return gulp.src([paths.app+names.anyJS])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
});

gulp.task('copy', function () {
	return gulp.src([paths.app+names.anyFile,'!'+paths.app+names.anyJS,'!'+paths.css,'!'+paths.app+names.anyHTML])
	.pipe(gulp.dest(paths.target));
});

gulp.task('minifyJS', function () {
	// Minificamos todos los JS de la aplicacion
	// ToDo: si se desea especificar un orden de empaquetado de JS ira aqui, sino sera alfabetico
	gulp.src([paths.lib+'/angular.js',paths.lib+'/angular-translate.js',paths.lib+names.anyJS,paths.app+'/app.js',paths.app+'/config.js',paths.app+'/service.js',paths.app+'/**/*.js'])
	.pipe(concat('app.min.js'))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(gulp.dest(paths.target));
	// Reemplazamos en el index la referencia de todos los JS al minificado
	return gulp.src(paths.target+'/index.html')
	.pipe(htmlreplace({
		'JS': ['app.min.js']
	},{'keepUnassigned':true,'keepBlockTags':true}))
	.pipe(gulp.dest(paths.target));
});

gulp.task('minifyCSS', function () {
	// Minificamos todos los CSS de la aplicacion
	// ToDo: si se desea especificar un orden de empaquetado de CSS ira aqui, sino sera alfabetico
	gulp.src([paths.css+'/reset.css',paths.lib+names.anyCSS,paths.css+names.anyCSS])
	.pipe(concat('app.min.css'))
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest(paths.target));
	// Reemplazamos en el index la referencia de todos los CSS al minificado
	return gulp.src(paths.target+'/index.html')
	.pipe(htmlreplace({
		'CSS': ['app.min.css']
	},{'keepUnassigned':true,'keepBlockTags':true}))
	.pipe(gulp.dest(paths.target));
});

// Debe lanzarse antes que las tareas de minificados
gulp.task('htmlify', function() {
    gulp.src([paths.app+names.anyHTML])
        .pipe(htmlify())
        .pipe(gulp.dest(paths.target));
});

// Levanta el servidor en modo test
gulp.task('startTestServer', function () {
	startExpress("test");
});

gulp.task('default', function () {
	startExpress("dev");
	gulp.watch(paths.scss+names.anyFile, ["compileCSS"]);
	gulp.watch(paths.app+names.anyFile, notifyLivereload);
});
