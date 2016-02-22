var Cache = (function(){

	var module = function(name){
		base.Mod.call(this,name);
		this.configMap.requires = ['utils'];
		this.configMap.maxSize = 256;
		this.stateMap.cache = [];
	};
	
	module.prototype = Object.create(base.Mod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.getObj = function(id, callback){
		//this.configMap.modules['utils'].async(getLocalObj(id, callback));
		this.getLocalObj(id, callback);
	};

	module.prototype.findObjIndex = function(id) {
		var result = -1;
		for(i=0; i < this.stateMap.cache.length; i++){
			var obj = this.stateMap.cache[i]
			if(image._id == id){
				result = i;
				break;
			}
		}
		return result;
	};

	module.prototype.push2Cache = function(image){
		this.stateMap.cache.push(image);
		thisd.maintainSize();
	};

	module.prototype.move2endAndGet = function(index){
		var result = this.stateMap.cache[index];
		this.stateMap.cache.splice(index, 1);
		this.stateMap.cache.push(result);
		return result;
	};

	module.prototype.maintainSize = function(){
		if(this.configMap.maxSize < this.stateMap.cache.len) 
			this.stateMap.cache.splice(0, (this.stateMap.cache.len - this.configMap.maxSize));
	};

	module.prototype.getObjFromApi = function(id, callback){
		console.log("module.prototype.getObjFromApi not implemented");
	};

	module.prototype.getLocalObj = function(id, callback){
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
			}(callback, this.push2Cache);

			var index = this.findObjIndex(id);

			if(0 > index)
				this.getObjFromApi(id, localCallback);
			else 
				callback.ok(this.move2endAndGet(index));
		}
		catch(err) {
			this.configMap.modules['utils'].logger.error(this.name, 'couldnt getLocalObj: ' + err);
		}
	};


	return { module: module };

}());