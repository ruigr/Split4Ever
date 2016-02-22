var SubCategoryCache = (function(){

	var module = function(name){
		Cache.module.call(this,name);
		this.configMap.events = []; 
		this.configMap.requires = ['utils', 'constants', 'api' ];
		//this.configMap.maxSize = 256;
		//this.stateMap.cache = [];
	};

	module.prototype = Object.create(Cache.module.prototype);
	module.prototype.constructor = module;
	
	module.prototype.getObjFromApi = function(id, callback){
		this.configMap.modules['api'].getSubCategories(callback);
	};

	return { module: module };

}());