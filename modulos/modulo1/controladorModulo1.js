app.controller('controladorModulo1', function(servicioRest, config, $scope) {

	$scope.campo1 = "valor";
	$scope.campo2 = config.atributoConstante;
	$scope.peticionAJAX = function () {
		servicioRest.getEntidades()
			.then(function(data) {
				console.log(data);
			})
			.catch(function(err) {
				console.log("Error");
			});
	}
});
