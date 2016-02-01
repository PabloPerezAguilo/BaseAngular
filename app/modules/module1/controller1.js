app.controller('controller1', function($scope,services) {
	$scope.mensaje = "Saludos desde el controlador1";

	services.getElementos()
	.then(function(data) {
		$scope.elementos = data;
	},function(response) {
		console.error("Ha sucedido un error: "+response.statusText);
	});
});