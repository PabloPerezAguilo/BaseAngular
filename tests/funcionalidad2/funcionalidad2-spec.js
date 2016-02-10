var AngularHomepage = require('./funcionalidad2-po.js');
describe('Funcionalidad 2 Test', function() {
	it('Navego hasta la seccion y accedo a la subseccion', function() {
		var angularHomepage = new AngularHomepage();
		angularHomepage.init();
		angularHomepage.linkSeccion2.click();
		angularHomepage.linkSubseccion1.click();
		expect(angularHomepage.mensaje.getText()).toEqual("Hello!");
	});
});