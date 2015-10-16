'use strict';

var app = angular.module('lisa', ['ngRoute']);
app.run(function(servicioRest, $rootScope, $http, $location) {

	// Establecemos las cabeceras por defecto. Las cabecera Authorization se modificara cuando el usuario se loge
	$http.defaults.headers.common['Accept'] = 'application/json, text/javascript';
	$http.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
	
});

app.config(function($routeProvider) {

	$routeProvider
	.when('/', {
		templateUrl: 'modulos/modulo1/modulo1.html',
		controller: 'controladorModulo1'
	})
	.when('/pageNotFound', {
		templateUrl: 'modulos/error/templateError.html'
	})
	.otherwise({
		redirectTo: "/pageNotFound"
	});
});

app.service('servicioRest', ServicioREST);

