/*
* Dependencias
*/
var gulp = require('gulp'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
connect = require('gulp-connect'),
jshint = require('gulp-jshint'),
war = require('gulp-war'),
zip = require('gulp-zip'),
open = require('gulp-open'),
htmlreplace = require('gulp-html-replace'),
clean = require('gulp-clean'),
ngAnnotate = require('gulp-ng-annotate'),
htmlify = require('gulp-angular-htmlify');
var runSequence = require('run-sequence').use(gulp);

var pathHTML=['./modulos/**/*.html','./index.html'];


gulp.task('default', ['info']);

gulp.task('server', function() {
	console.log("Arrancamos el server");
	connect.server({
		port: 80,
		root: './',
		livereload: true,
	});
});

gulp.task('abrirTab', function(){
	console.log("Abrimos una pestaña del navegador");
	var options = {
		url: 'http://localhost:80',
		app: 'chrome'
	};
	gulp.src('./index.html')
	.pipe(open('', options));
});

// minificado de todos los JS
gulp.task('minifyJS', function () {
	console.log("Iniciamos la unificacion y minificado de los JS");
	gulp.src(['target/files/app.js','target/files/services.js','target/files/config.js','target/files/modulos/**/*.js'])
	.pipe(concat('app.min.js'))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(gulp.dest('target/files/'));
	return gulp.src('target/files/index.html')
	.pipe(htmlreplace({
		'JS': ['app.min.js']
	},{'keepUnassigned':true,'keepBlockTags':true}))
	.pipe(gulp.dest('target/files/'));
});

gulp.task('validate', function () {
	console.log("Iniciamos jshint");
	return gulp.src(['**/*.js',"!node_modules/**","!node_modules","!test/**","!test","!target/**","!package.json","!gulpfile.js","!js/*"])
	.pipe(jshint())
	.pipe(jshint.reporter('default'))
});

gulp.task('package',function () {
	console.log("Iniciamos la generacion del WAR");
	return gulp.src(["target/files/**"])
	.pipe(war({
		welcome: 'index.html',
		displayName: 'Grunt WAR',
	}))
	.pipe(zip('LisaFront.war'))
	.pipe(gulp.dest("target"));

});

gulp.task('copy', function () {
	console.log("Iniciamos la copia de ficheros");
	return gulp.src(["**","!node_modules/**","!node_modules","!test/**","!test","!target/**","!target","!package.json","!gulpfile.js","!*.bat"])
	.pipe(gulp.dest("target/files/"));
});

gulp.task('clean', function () {
	console.log("Borramos directorio");
	return gulp.src('target', {read: false})
	.pipe(clean());
});

gulp.task('cdnReplace', function() {
	console.log("Reemplazamos las librerias por los CDNs de index");
	return gulp.src('target/files/index.html')
	.pipe(htmlreplace({

		'JSCDNs': [
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-route.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-mocks.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-messages.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-animate.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-aria.min.js',
		'js/angular-material.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/2.3.0/ng-tags-input.min.js',
		'https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-114/assets-cache.js',
		'https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.6/d3.min.js',
		'https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.js'],

		'CSSCDNs': [
		'https://ajax.googleapis.com/ajax/libs/angular_material/0.8.3/angular-material.min.css',
		'https://mbenford.github.io/ngTagsInput/css/ng-tags-input.min.css',
		'https://cdnjs.cloudflare.com/ajax/libs/c3/0.4.10/c3.min.css']

	},{'keepUnassigned':true,'keepBlockTags':true}))
	.pipe(gulp.dest('target/files/'));
});

gulp.task('htmlify', function() {
    gulp.src(['**/*.html','index.html',"!node_modules/**","!node_modules", "!target/**","!target"])
        .pipe(htmlify())
        .pipe(gulp.dest('target/files/'));
});

gulp.task('DEV', function () {
	console.log("Empaquetamos modo DEV");
	runSequence('clean','copy','package');
});

gulp.task('PRO', function () {
	console.log("Empaquetamos modo PRO");
	runSequence('clean','copy','minifyJS','htmlify','cdnReplace');
});


gulp.task('info', function () {
	console.log("\n\n\nLISTADO DE OPCIONES");
	console.log("------------------------");
	console.log("'package': Solo Empaqueta el WAR");
	console.log("'DEV': Limpia y Empaqueta el WAR");
	console.log("'PRO': Limpia y Empaqueta el WAR minificando, poniendo los CDNs y estandarizando HTML");
	console.log("'minifyJS': Minifica");
	console.log("'cdnReplace': Reemplaza por los CDNs");
	console.log("'validate': Valida los JS con jshint");
	console.log("'start': Arranca servidor y abre pestaña navegador");
	console.log("'server': Arranca servidor");
	console.log("'abrirTab': Abre pestaña navegador");
	console.log("\n\n\n");
});