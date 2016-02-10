var AngularHomepage = require('./funcionalidad1-po.js');
describe('Funcionalidad 1 Test', function() {
	it('Navego hasta la seccion', function() {
		var angularHomepage = new AngularHomepage();
		angularHomepage.init();
		angularHomepage.linkSeccion1.click();
		expect(angularHomepage.mensaje.getText()).toEqual("Saludos desde el controlador1");
	});
	it('Navego hasta la seccion y obtengo el listado de 4 elementos', function() {
		var angularHomepage = new AngularHomepage();
		angularHomepage.init();
		angularHomepage.linkSeccion1.click();
		expect(angularHomepage.resultados.count()).toEqual(4);
		expect(angularHomepage.resultados.get(0).getText()).toEqual("1 -- elemento1");
	});
});