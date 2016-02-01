var app = angular.module('myApp', ['ngRoute','pascalprecht.translate']);

// Configuracion para la internacionalizacion
app.config(['$translateProvider', function ($translateProvider) {
	
	// Carga asincrona de ficheros
	$translateProvider.useStaticFilesLoader({
		prefix: 'locales/locale_',
		suffix: '.json'
	});

	// Idioma por defecto
	$translateProvider.preferredLanguage('es');
	$translateProvider.useSanitizeValueStrategy('escaped');
}]);

app.config(function($routeProvider) {

	var path = "modules/";

	$routeProvider
	.when('/', {
		template : 'Pagina por defecto'
	})
	.when('/seccion1', {
		templateUrl : path+'module1/view1.html',
		controller  : 'controller1'
	})
	.when('/seccion2', {
		templateUrl : path+'module2/view2.html',
		controller  : 'controller2'
	})
	.otherwise({
		redirectTo: '/'
	});
});

app.run(function() {
	console.log("arrancado");		
});