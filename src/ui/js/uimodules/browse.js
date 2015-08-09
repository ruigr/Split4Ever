var Browse = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.active = false;
		this.configMap.events = ['onBody'];
		this.configMap.requires = ['api', 'widgets', 'browseui', 'utils', 'pubsub'];
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;
	/*
		item: {
				_id: null,
				images:[],
				name: '',
				notes: '',
				price: ''
			}
	*/
	
	module.prototype.initModule = function($container){
		this.configMap.modules['pubsub'].subscribe(this.configMap.events, this);
		this.configMap.uicontainer = $container;
		this.setJqueryMap();
	};

	module.prototype.setJqueryMap = function(){
		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer
		};
	};

	module.prototype.onEvent = function(event, data){
		this.configMap.modules['utils'].logger.enter(this.name, 'onEvent');

		if(event == "onBody" && null != data.body && data.body == "browse"){
			this.configMap.uicontainer.empty();
			if(null != data.body && data.body == "browse"){
				this.setActive(true);

				var callback = (function(uimodule, uielement) {
						
						var ok = function(o){
							console.log('ok...loading items');
								uimodule.loadItems(o, uielement);
						};

						var nok = function(o){
							console.log('not ok');
						};

						return {
							ok: ok,
							nok: nok
						};
					}(this.configMap.modules['browseui'], this.stateMap.jqueryMap.$container));

				this.configMap.modules['api'].getItems(null,callback);
			}
			else {
				this.setActive(false);
				//remove all objects from our conainer element in dom
				//this.stateMap.jqueryMap.$browser.empty();
			}
		}
		
		this.configMap.modules['utils'].logger.leave(this.name, 'onEvent');
	};

	return { module: module };

}());