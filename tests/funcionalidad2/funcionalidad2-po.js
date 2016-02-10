var AngularHomepage = function() {
	this.init = function(){
		browser.get('/');
	}
	this.linkSeccion2 = element(by.css('a[href*="#/seccion2"]'));
	this.linkSubseccion1 = element(by.css('a[href*="#/seccion2/hi"]'));
	this.mensaje = element(by.css('h1'));
};
module.exports = AngularHomepage;