var Footer = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.setJqueryMap = function(){
		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer
		};
	};

	module.prototype.initUi = function(){

		var p1 = document.createElement("p1");
		$( this.configMap.uicontainer ).append(p1);
		p1.classList.add("text-muted");
		p1.classList.add("pull-right");
		p1.classList.add("small");
		p1.innerHTML = "Pecas classicas <em>VW</em>. Compra e venda de material novo(new old stock), usado e recondicionado &copy; 2015 vwparts";

	};

	return { module: module };

}());