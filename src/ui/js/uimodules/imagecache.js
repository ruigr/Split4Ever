var ImageCache = (function(){

	/*image = {
		name:  ,
		data:
	};*/

	var instance;

	var module = function(name){
		base.Mod.call(this,name);
		this.configMap.requires = ['utils', 'api'];
		this.configMap.maxSize = 256;
		this.stateMap.cache = [];
	};
	
	module.prototype = Object.create(base.Mod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.getImage = function(id, callback){
		this.configMap.modules['utils'].async(getImageLocal(id, callback));
	};

	var push2Cache = function(image){
		this.stateMap.cache.push(image);
		maintainSize();
	};

	var move2endAndGet = function(index){
		var result = this.stateMap.cache[index];
		this.stateMap.cache.splice(index, 1);
		this.stateMap.cache.push(result);
		return result;
	};

	var maintainSize = function(){
		if(this.configMap.maxSize < this.stateMap.cache.len) 
			this.stateMap.cache.splice(0, (this.stateMap.cache.len - this.configMap.maxSize));
	};

	var findImageIndex = function(id) {
		var result = -1;
		for(i=0; i < this.stateMap.cache.length; i++){
			var image = this.stateMap.cache[i]
			if(image.id == id){
				result = i;
				break;
			}
		}
		return result;
	};

	var getImageLocal = function(id, callback){
		var result = null;
		try {

			var localCallback = function(xcb, cacheOp){
				var ok = function(o){
					xcb.ok(o);
					cacheOp(o);
				};
				var nok = function(e){
					xcb.nok(e);
				};
				return {
					ok: ok,
					nok: nok
				};
			}(callback, push2Cache);

			var index = findImageIndex(id);

			if(0 > index)
				this.configMap.modules['api'].getImage(id, localCallback);
			else 
				callback.ok(move2endAndGet(index));
		}
		catch(err) {
			this.configMap.modules['utils'].logger.error(this.name, 'couldnt getImageLocal: ' + err);
		}
	};


	var getInstance = function(){
		if(!instance){
			instance = new module('imagecache');
		}
		return instance;
	};


	return { getInstance: getInstance };

}());