
var Module = function(name){
	this.name = name;
	this.config = {
		requires: [] //string array with required mdule names
		, events: []
		, modules: {} // modules map: name -> mod
		, loggerLevel : 0
	}; 
	this.context = {
		anchor_map : {}	
		, dollarMap: {}
	}; 

	this.logger = function(name, level){

		var print = function(message){
			console.log("[" + new Date().toUTCString() + " | " + name + "]"  + message);
		};

		// level 1
		var enter  = function(method){
			if( 1 >= level)
				print("<IN> " + method);
		};
		var leave  = function(method){
			if( 1 >= level)
				print("<OUT> " + method);
		};
		var trace  = function(msg){
			if( 1 >= level)
				print("<TRACE> " + msg);
		};
		// level 2
		var debug = function(msg){
			if( 2 >= level)
				print('<LOG> ' + msg);
		};
		//level 3
		var info = function(msg){
			if( 3 >= level)
				print('<INFO> ' + msg);
		};
		//level 4
		var warn = function(msg){
			if( 4 >= level)
				print('<WARNING> ' + msg);
		};

		var error = function(msg){
			print('<ERROR> ' + msg);
		};
		
		
		return {
			  in: enter
			, out: leave
			, trace: trace
			, debug: debug
			, info: info
			, error: error
			, warn: warn
		};


	}(this.name, this.config.loggerLevel);

}

Module.prototype.init = function(){
	this.logger.in('init');
	if(null != this.config.requires ){

		for(i = 0; i < this.config.requires.length; i++){
			var requirement = this.config.requires[i];
			var instance = null;
			//try to find the module in the global APP object
			instance = APP.findModule(requirement);
			if(null != instance){
				this.config.modules[requirement.toLowerCase()] = instance;
				this.logger.debug('got module instance '+ requirement + " from APP global object");
			}
			else {
				// if not provided by APP then lets create the module
				var classDefinition = classForName(requirement);
				if(null != classDefinition){
					instance = new classDefinition(requirement.toLowerCase());
					this.logger.debug('creating module instance '+ requirement + " from class");
				}
				else
					this.throw('!!! could not find module:' + requirement + ' !!!');
			}

			this.config.modules[requirement.toLowerCase()] = instance;
		}

		for( modName in this.config.modules){
			if(this.config.modules.hasOwnProperty(modName)){
				var module = this.config.modules[modName];
				module.init();
				this.logger.debug('called init on module instance '+ modName);

				if(modName == 'pubsub' && 0 < this.config.events.lenght ){
					//register events if necessary
					var pubsub = this.config.modules[modName];
					pubsub.subscribe(this.config.events, this);
					this.logger.debug('subscribed for events: ' + this.config.events);
				}

			}
		}
	}
	this.logger.out('init');
};

Module.prototype.shutdown = function(){
	this.logger.debug(this.name + ".shutdown is not implemented");
};

Module.prototype.start = function(){
	this.logger.debug(this.name + ".run is not implemented");
};

Module.prototype.stop = function(){
	this.logger.debug(this.name + ".halt is not implemented");
};

Module.prototype.getDollarMap = function(){
	return this.context.dollarMap;
};

Module.prototype.getName = function(){
	return this.name;
};

Module.prototype.getContext = function(context){
	return this.context;
};

Module.prototype.throw = function(msg){
	throw new Error( "origin: " + this.name + " | msg: " + msg );
};

Module.prototype.addContext = function(ctxMap){
	this.logger.in('addContext');
	for (var key in ctxMap) {
	  if (ctxMap.hasOwnProperty(key)) {
	    Object.defineProperty(this.context, key, { value: ctxMap[key] });
	  }
	}
	this.logger.out('addContext');
};

Module.prototype.addConfiguration = function(confMap){
	this.logger.in('addConfiguration');
	for (var key in confMap) {
	  if (confMap.hasOwnProperty(key)) {
	    Object.defineProperty(this.config, key, { value: confMap[key]} );
	  }
	}
	this.logger.out('addConfiguration');
};
