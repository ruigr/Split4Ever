
var Utils = (function() {

	var module = function(name){
		common.Mod.call(this,name);
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;


	module.prototype.logger = (function(){
		var print = function(moduleName, message){
			console.log("[" + new Date().toUTCString() + " | " + moduleName + "]"  + message);
		};
		var enter  = function(moduleName, method){
			print(moduleName, "@" + method);
		};
		var leave  = function(moduleName, method){
			print(moduleName, method + "@");
		};
		var log = function(moduleName, msg){
			print(moduleName, msg);
		};
		
		return {
			enter: enter,
			leave: leave,
			log: log
		};

	})();


	module.prototype.readFileAsBase64 = function(file, callback){
		var reader = new FileReader();
		reader.onload = function(event){
			var data = event.target.result.replace("data:"+ file.type +";base64,", '');
			callback(data, file);
		};
		reader.readAsDataURL(file);
	};


	return { module: module};

}());
