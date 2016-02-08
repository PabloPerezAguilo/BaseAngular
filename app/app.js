var app = angular.module('myApp', ['ui.router','pascalprecht.translate']);

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

app.config(function($stateProvider, $urlRouterProvider) {

	var path = "modules/";
	$urlRouterProvider.otherwise("/inicio");

	$stateProvider
	.state('inicio', {
		url: "/inicio",
		template: "Pagina por defecto'"
	})
	.state('seccion1', {
		url: "/seccion1",
		templateUrl : path+'module1/view1.html',
		controller  : 'controller1'
	})
	.state('seccion2', {
		url: "/seccion2",
		templateUrl : path+'module2/view2.html',
		controller  : 'controller2',
	})
	.state('seccion2.hi', {
		url: "/hi",
		template: "<h1>Hello!</h1>"
	})
	.state('seccion2.bye', {
		url: "/bye",
		template: "<h1>Bye!</h1>"
	})
	.state('seccion3', {
		url: "/seccion3",
		templateUrl : path+'module3/view3.html',
	})
	.state('seccion3.1', {
		url: "/1",
		views: {
			"viewA": { template: "Seccion 3.1 apartado A" },
			"viewB": { template: "Seccion 3.1 apartado B" }
		}
	})
	.state('seccion3.2', {
		url: "/2",
		views: {
			"viewA": { template: "Seccion 3.2 apartado A" },
			"viewB": { template: "Seccion 3.2 apartado B" }
		}
	});
});

app.run(function() {
	console.log("arrancado");		
});