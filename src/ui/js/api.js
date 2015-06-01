var Api = (function(){

	var module = function(name){
		common.Mod.call(this,name);
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;
	
	/*	item: {
				id: null,
				images:[],
				name: '',
				notes: '',
				price: ''
			}*/

	module.prototype.setItem = function(item, callback){

		console.log('item: ' + JSON.stringify(item));
		var url = window.location.origin + '/api/item'; 
		$.post(url, item).done(callback.ok).fail(callback.nok);
		
	};


	return { module: module };

}());
