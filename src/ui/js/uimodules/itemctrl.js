var ItemCtrl = (function(){

	var module = function(name){
		base.UIMod.call(this,name);
		this.configMap.events = ['onBody' ];
		this.configMap.requires = ['utils', 'pubsub'];
	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;
	

	module.prototype.onEvent = function(event, data){

		this.configMap.modules['utils'].logger.enter(this.name, s.sprintf('onEvent(%s,%s)',event, data));

		if(event == "onBody" && null != data.body && "item" == data.body ) {

			this.configMap.uicontainer = data.container;
			this.configMap.uicontainer.empty();

			if( (null != data.config) && (null != data.config.id) ){
				if(null == data.config.mode)
					data.config.mode = 'view';
			}
			else 
				data.config = {mode : 'edit'};
			
			data.config.container = this.configMap.uicontainer;
			this.configMap.modules['pubsub'].publish('request.item', data.config);

		}

		this.configMap.modules['utils'].logger.leave(module.name, 'onEvent');
	};


	return { module: module };

}());
