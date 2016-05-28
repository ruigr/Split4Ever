var Header = function(name){
	Module.call(this, name);
	this.config.requires = ['Utils'];
};

Header.prototype = Object.create(Module.prototype);
Header.prototype.constructor = Header;

