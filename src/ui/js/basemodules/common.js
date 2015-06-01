
var common = (function() {

	
	var Mod = function(name){
		this.name = name;
		this.active = true;
		this.configMap = {
			//requires: ['api'];
			requires: [],
			events: ['onAnchor'],
			api : null
		}; 
		this.stateMap = {
			anchor_map : {}	

		}; 
	};

	Mod.prototype.getName = function(){
		return this.name;
	};
	
	Mod.prototype.isActive = function(){
		return this.active;
	};

	Mod.prototype.setActive = function(value){
		this.active = value;
	};

	Mod.prototype.onEvent = function(event, data){
		console.log("Mod.prototype.onEvent not implemented");
	};

	Mod.prototype.setEvents = function(){
		console.log("Mod.prototype.setEvents not implemented");
	};

	Mod.prototype.initModule = function($container){
		if(null != this.configMap.events)
			pubsub.subscribe(this.configMap.events, this);
	};

	Mod.prototype.setApi = function(api){
		this.configMap.api = api;
	};
	
	Mod.prototype.requires = function(dependency){
		var result = false;
		if(Array.isArray(this.configMap.requires)){
			for( var i = 0 ; i < this.configMap.requires.length ; i++ ){
				var req = this.configMap.requires[i];
				if( req == dependency){
					result = true;
					break;
				}
			}
		}
		return result;
	};

	var UIMod = function(name){
		Mod.call(this,name);
		this.configMap = {
			main_html : "",
			container : null
		}; 
		this.stateMap = {
			anchor_map : {},
			jqueryMap : {}	
		}; 
	};

	UIMod.prototype = Object.create(Mod.prototype);

	UIMod.prototype.setJqueryMap = function($container){
		console.log("UIMod.prototype.setJqueryMap not implemented");
	};

	UIMod.prototype.initModule = function($container){
		if(null != this.configMap.events)
			pubsub.subscribe(this.configMap.events, this);
		
		this.configMap.container = $container;
		$container.html(this.configMap.main_html);
		this.setJqueryMap($container);
		this.setEvents();
	};

	return { Mod: Mod,
		UIMod: UIMod };

}());
