
var classForName = function(clazz){

	type = "function";  // can pass "function"
    var arr = clazz.split(".");

    var o = (window || this);
    for (var i = 0; i < arr.length; i++) {
        o = o[arr[i]];
    }
    if (typeof o !== type) {
        throw new Error(type +" not found: " + clazz);
    }

    return  o;
}

var APP = new function(){

	var running = false;
	var modulesConf = { requires: [ 'Utils', 'Constants', 'PubSub', 'UiShell' ] };
	
	var app = new App('app');
	app.configure(modulesConf);
	app.init();
	app.addContext({ bootstrapModule: 'uishell' });

	var run = function(context){
		if(running)
			throw new Error("!!! Already running !!!");
		app.addContext(context);
		app.run();
		running = true;
	};

	return {
		run: run ,
		getModules : app.getLoadedModules
	};

}();