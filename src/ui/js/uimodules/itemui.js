var ItemUI = (function(){

	var module = function(name){
		base.Mod.call(this,name);
		this.configMap.events = [ 'display.item' ]; 
		this.configMap.requires = ['utils', 'pubsub'];
		this.stateMap.context = null; 
	};

	module.prototype = Object.create(base.Mod.prototype);
	module.prototype.constructor = module;

	module.prototype.onEvent = function(event, context){

		this.configMap.modules['utils'].logger.enter(this.name, s.sprintf('onEvent(%s,%s)',event, context));

		if( event == 'display.item' ) {
			this.stateMap.context = context;
			
			//create ui

			//display item

			//apply events			

			if(null == this.stateMap.context.id){
				this.configMap.modules['pubsub'].publish('got.item', this.stateMap.context);
			}
			else {
				var callback = function(mod){
					var ok = function(o){
						mod.stateMap.context.item = o;
						mod.configMap.modules['pubsub'].publish('got.item', mod.stateMap.context);
					};
					var nok = function(o){
						mod.configMap.modules['utils'].logger.error(mod.name, o);
					};
					return {ok: ok, nok: nok};
				} (this);
				this.configMap.modules['api'].getItem(this.stateMap.context.id, callback);
			}
		}
		this.configMap.modules['utils'].logger.leave(module.name, 'onEvent');
	};

	return { module: module };

}());
