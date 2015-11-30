var Footer = (function(){

	var module = function(name){
		base.UIMod.call(this,name);
		this.configMap.events = ['onContainerDefinition'];
		this.configMap.requires = ['utils', 'pubsub'];
	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.initUI = function(){
		var p1 = this.configMap.modules['utils'].createElement('p', ["text-muted","pull-right", "small"]);
		$( this.configMap.uicontainer ).append(p1);
		p1.innerHTML = "Pecas classicas <em>VW</em>. Compra e venda de material novo(new old stock), usado e recondicionado &copy; 2015 vwparts";
	};

	module.prototype.onEvent = function(event, data){
		this.configMap.modules['utils'].logger.enter(this.name, 'onEvent[' + event + ']');
		if(event == 'onContainerDefinition'){
			this.configMap.modules['utils'].logger.info(this.name, 'received container, going to show');
			this.show(data.footer);
		}
		this.configMap.modules['utils'].logger.leave(this.name, 'onEvent');
	};

	return { module: module };

}());