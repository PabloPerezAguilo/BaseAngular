var AngularHomepage = function() {
	this.init = function(){
		browser.get('/');
	}
	this.linkSeccion1 = element(by.css('a[href*="#/seccion1"]'));
	this.mensaje = element(by.binding('mensaje'));
	this.resultados = element.all(by.repeater('e in elementos'));
};
module.exports = AngularHomepage;