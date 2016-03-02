var Footer = function(name){
	Module.call(this, name);
	this.config.requires = ['Utils'];
};

Footer.prototype = Object.create(Module.prototype);
Footer.prototype.constructor = Footer;

