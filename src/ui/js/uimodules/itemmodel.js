var ItemModel = (function(){

	var module = function(name){
		base.Mod.call(this,name);
		this.configMap.events = ['request.item', 'persist.item', 'remove.item']; 
		this.configMap.requires = ['utils', 'pubsub', 'api'];
		this.stateMap.context = {
			item : {
				_id: null,
				images:[
				//'','',''...... objectIDs
				],
				name: '',
				notes: '',
				price: '',
				category:'', // {name: '....'}
				subCategory: '' // {name: '....', category:'....'}
			}
		}; 
	};

	module.prototype = Object.create(base.Mod.prototype);
	module.prototype.constructor = module;

	module.prototype.onEvent = function(event, context){

		this.configMap.modules['utils'].logger.enter(this.name, s.sprintf('onEvent(%s,%s)',event, context));

		this.stateMap.context = this.configMap.modules['utils'].copyObjProps2Obj(context, this.stateMap.context);

		if( event == 'request.item' ) {
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

		if( event == 'persist.item' ) {

			var callback = function(mod){
				var ok = function(o){
					mod.stateMap.context.item._id = o;
					mod.configMap.modules['pubsub'].publish('got.item', mod.stateMap.context);
				};
				var nok = function(o){
					module.configMap.modules['utils'].logger.error(module.name, o);
				};
				return {ok: ok, nok: nok};
			}(this);

			this.configMap.modules['api'].setItem(this.stateMap.context.item, callback);
		}

		if( event == 'remove.item' ) {

			var callback = function(mod){
				var ok = function(o){
					window.location = window.location.origin + '/#body=browser';
				};
				var nok = function(o){
					module.configMap.modules['utils'].logger.error(module.name, o);
				};
				return {ok: ok, nok: nok};
			}(this);

			this.configMap.modules['api'].delItem(this.stateMap.context.item._id, callback);
		}

		this.configMap.modules['utils'].logger.leave(module.name, 'onEvent');
	};

	return { module: module };

}());
