var ItemModel = (function(){

	var module = function(name){
		base.Mod.call(this,name);
		this.configMap.events = []; 
		this.configMap.requires = ['utils', 'pubsub', 'api'];
		this.configMap.constants = { };
		this.stateMap.item = {
				_id: null,
				images:[],
				name: '',
				notes: '',
				price: '',
				category:'',
				subCategory: ''
			}; 
	};

	module.prototype = Object.create(base.Mod.prototype);
	module.prototype.constructor = module;

	module.prototype.initModule = function($container){
		this.configMap.modules['pubsub'].subscribe(this.configMap.events, this);
		this.configMap.uicontainer = null;
	};

	module.prototype.init = function(id){
		this.stateMap.item._id=id;
		this.loadModel();
	};

	module.prototype.loadModel = function(){

		if(this.stateMap.item._id){
			var callback = function(mod){
				var module = mod;
					var ok = function(o){
						module.stateMap.item = o;
						module.configMap.modules['pubsub'].publish('model.update', module.stateMap.item);
					};
					var nok = function(o){
						module.configMap.modules['utils'].logger.error(module.name, o);
					};
					return {ok: ok, nok: nok};
			}(this);
			this.configMap.modules['api'].getItem(this.stateMap.item._id, callback);
		}
		else{
			this.stateMap.item = { _id: null, images:[], name: '',
				notes: '', price: '', category:'', subCategory: '' };
			this.configMap.modules['pubsub'].publish('model.update', this.stateMap.item);
		}

	};

	module.prototype.persist = function(){

		var callback = function(mod){
			var module = mod;
			var ok = function(o){
				module.stateMap.item._id = o;
				module.configMap.modules['pubsub'].publish('model.update', module.stateMap.item);
			};
			var nok = function(o){
				module.configMap.modules['utils'].logger.error(module.name, o);
			};
			return {ok: ok, nok: nok};
		}(this);

		this.configMap.modules['api'].setItem(this.stateMap.item, callback);

	};

	module.prototype.remove = function(){
		var callback = function(mod){
			var module = mod;
			var ok = function(o){
				window.location = window.location.origin + '/#body=browse';
			};
			var nok = function(o){
				module.configMap.modules['utils'].logger.error(module.name, o);
			};
			return {ok: ok, nok: nok};
		}(this);

		this.configMap.modules['api'].delItem(this.stateMap.item._id, callback);
	};

	module.prototype.get = function(){
		return this.stateMap.item;
	};

	module.prototype.set = function(property, value){

		if( this.stateMap.item.hasOwnProperty(property) ){
			this.stateMap.item[property] = value;
			this.configMap.modules['pubsub'].publish('model.update', this.stateMap.item);
		}
		else{
			this.configMap.modules['utils'].logger.warn(this.name, 'tried to set an unknown model property');
		}

	};

	return { module: module };

}());
