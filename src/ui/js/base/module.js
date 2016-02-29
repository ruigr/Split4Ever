
var Module = function(name){
	this.name = name;
	this.configMap = {
		requires: [] //string array with required mdule names
		, events: []
		, modules: {} // modules map: name -> mod
	}; 
	this.stateMap = {
		anchor_map : {}	,
		context: {}
	}; 
}

Module.prototype.loggerLevel = 0;

Module.prototype.init = function(){
	if(null != this.configMap.events){
		if(this.configMap.modules.hasOwnProperty('pubsub')){
			var pubsub = this.configMap.modules['pubsub'];
			pubsub.subscribe(this.configMap.events, this);
		}
	} 
};

Module.prototype.run = function(){
	this.logger.log(this.name + ".run is not implemented");
};

Module.prototype.getName = function(){
	return this.name;
};

Module.prototype.getContext = function(context){
	return this.stateMap.context;
};

Module.prototype.throw = function(msg){
	throw new Error( "origin: " + this.name + " | msg: " + msg );
};

Module.prototype.addContext = function(ctxMap){
	this.logger.in('addContext');
	for (var key in ctxMap) {
	  if (ctxMap.hasOwnProperty(key)) {
	    Object.defineProperty(this.stateMap.context, key, { value: ctxMap[key] });
	  }
	}
	this.logger.out('addContext');
};

Module.prototype.configure = function(confMap){
	this.logger.in('configure');
	for (var key in confMap) {
	  if (confMap.hasOwnProperty(key)) {
	    Object.defineProperty(this.configMap, key, { value: confMap[key]} );
	  }
	}
	this.logger.out('configure');
};

Module.prototype.requires = function(dependency){
	this.logger.in('requires');
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
	this.logger.out('requires');
	return result;
};

Module.prototype.logger = (function(){

		var print = function(message){
			console.log("[" + new Date().toUTCString() + " | " + this.name + "]"  + message);
		};

		// level 1
		var enter  = function(method){
			if( 1 <= this.loggerLevel)
				print("<IN> " + method);
		};
		var leave  = function(method){
			if( 1 <= this.loggerLevel)
				print("<OUT> " + method);
		};
		var trace  = function(msg){
			if( 1 <= this.loggerLevel)
				print("<TRACE> " + msg);
		};
		// level 2
		var log = function(msg){
			if( 2 <= this.loggerLevel)
				print('<LOG> ' + msg);
		};
		//level 3
		var info = function(msg){
			if( 3 <= this.loggerLevel)
				print('<INFO> ' + msg);
		};
		//level 4
		var warn = function(msg){
			if( 4 <= this.loggerLevel)
				print('<WARNING> ' + msg);
		};

		var error = function(msg){
			print('<ERROR> ' + msg);
		};
		
		
		return {
			  in: enter
			, out: leave
			, trace: trace
			, log: log
			, info: info
			, error: error
			, warn: warn
		};

	})();