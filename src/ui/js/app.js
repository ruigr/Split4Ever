var App = function(name){

	Module.call(this, name);
	//this.configMap.requires= modClassNameArray; //string array with required mdule names

	//private function to load the modules
	this.loadModules = function(){
		if(0 == this.configMap.requires.length )
			this.throw('!!! must add module class names to the requires array !!!');

		for(i = 0; i < this.configMap.requires.length; i++){
			var modClass = this.configMap.requires[i];
			var modName = modClass.toLowerCase();

			if(!this.configMap.modules.hasOwnProperty(modName)){
				var classDefinition = classForName(modClass);
				var module = new classDefinition(modName);
				this.configMap.modules[modName] = module;
				console.log('created instance of module ' + modClass);
			}
		}
	};

	this.initModules = function(){
		//set up modules dependencies
		for(modName in this.configMap.modules){
			if(this.configMap.modules.hasOwnProperty(modName)){
				var module = this.configMap.modules[modName];
				//for every module
				var confMap = {
					modules:{}
				};
				var dependencies = this.findLoadedModules(module.configMap.requires);
				for(i = 0; i < module.configMap.requires.length; i++){
					var name =  module.configMap.requires[i];
					var mod = dependencies[i];
					confMap.modules[name] = mod;
					console.log('collecting module dependency ' + name + ' to module ' + module.getName());
				}
				module.configure(confMap);
				console.log('configured dependencies in module ' + module.name);
				module.init();
				console.log('called init on module ' + module.name);
				
			}
		}
	};
	
};

App.prototype = Object.create(Module.prototype);
App.prototype.constructor = App;

App.prototype.findLoadedModules = function(arrStr){
	var result = [];
	for(i = 0; i < arrStr.length; i++){
		var modName = arrStr[i];
		this.configMap.modules.hasOwnProperty(modName)
			result.push(this.configMap.modules[modName]);
	}
	return result;
};

App.prototype.getLoadedModules = function(){
	// TODO return copy not the actual object
	return this.configMap.modules;
};

App.prototype.init = function(){
	this.loadModules();
	this.initModules();
};

App.prototype.run = function(){

	if( null == this.stateMap.context.bootstrapModule )
		this.throw('!!! we need a botstrap module !!!');

	var bootstrapMod = this.configMap.modules[this.stateMap.context.bootstrapModule];

	if( null == bootstrapMod)
		this.throw('!!! botstrap module not previously loaded !!!');

	if( null == this.stateMap.context.container )
		this.throw('!!! we need a container to load the bootstrap module !!!');

	bootstrapMod.addContext({ container: this.stateMap.context.container });
	bootstrapMod.run();
};
