exports.config = {
	baseUrl : "http://localhost",
	seleniumAddress: 'http://localhost:4444/wd/hub',
	//specs: ['funcionalidad1/*.js']
	suites: {
		funcionalidad1 : "funcionalidad1/*.js",
		funcionalidad2 : "funcionalidad2/*.js"
	}
};