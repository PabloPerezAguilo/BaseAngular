var gulp = require('gulp');
var lr = require('gulp-livereload');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');

var paths = {
	app : "app",
	lib : "lib",
	scss : "sass/**/*.scss",
	css : "app/css"
};


function startExpress() {
	var express = require('express');
	var app = express();
	app.use(require('connect-livereload')());
	app.use(express.static(__dirname + "/"+paths.app));
	app.use(express.static(__dirname + "/"+paths.lib));

	app.get("/api/:fichero", function(req, res) {
		res.sendfile(req.params.fichero+".json", {root: './mocks'});
	});

	app.listen(80);
	// Start livereload
	lr.listen(35729);
}

function notifyLivereload(file) {
	lr.reload(file);
}

gulp.task('compileCSS', function () {
	console.log("Actualizando CSSs");
	return gulp.src(paths.scss)
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest(paths.css));
});

gulp.task('validate', function () {
	return gulp.src(['app/**/*.js'])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
});

gulp.task('minifyJS', function () {
	// Minificamos todos los JS de la aplicacion
	gulp.src(['lib/angular.js','lib/**/*.js','app/app.js','app/config.js','app/service.js','app/**/*.js'])
	.pipe(concat('app.min.js'))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(gulp.dest('target/'));
	// Reemplazamos en el index la referencia de todos los JS al minificado
	/*return gulp.src('target/index.html')
	.pipe(htmlreplace({
		'JS': ['app.min.js']
	},{'keepUnassigned':true,'keepBlockTags':true}))
	.pipe(gulp.dest('target/'));*/
});

gulp.task('default', function () {
	startExpress();
	gulp.watch(paths.scss, ["compileCSS"]);
	gulp.watch(paths.app+"/**/*", notifyLivereload);
});
