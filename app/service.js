app.service('services', function ($http, $q, $rootScope, config) {
	
	var url = config.url;
	
	/* ---------- GESTION DE ERRORES DE SERVICIOS GENERICA ---------- */

	// Funcion comun para gestion de los errores en funcion del codigo http
	function tratarError(data, status, defered) {
		if (status === 404 || status === 0) {
			defered.reject("Servicio no disponible");
		} else {
			defered.reject("Error: " + status);
		}
	}

	// Funcion comun para montar una llamada http y gestionar la respuesta con otra promesa
	function peticionHTTP(conf){
		var defered = $q.defer();
		var promise = defered.promise;

		$http(conf)
		.then(function(response) {
			defered.resolve(response.data);
		},function(data, status, headers, config) {
			tratarError(data, status, defered);
		});

		return promise;
	}

	/* ---------- SERVICIOS ---------- */
	return {
		getElementos : function (nuevaEncuesta) {
			return peticionHTTP({
				method: 'GET',
				url: url + '/elementos',
				data: nuevaEncuesta
			});
		}
	}
	
});