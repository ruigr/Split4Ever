var Api = (function(){

	var module = function(name){
		common.Mod.call(this,name);
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;
	
	/*	item: {
				_id: null,
				images:[],
				name: '',
				notes: '',
				price: ''
			}*/

	module.prototype.setItem = function(item, callback){
		console.log('@Api.setItem');
		console.log('item: ' + JSON.stringify(item));
		var url = window.location.origin + '/api/item'; 
		$.post(url, item).done(callback.ok).fail(callback.nok);
		console.log('Api.setItem@');
	};

	module.prototype.getItems = function(item, callback){
		console.log('@Api.getItems');
		var url = window.location.origin + '/api/items'; 
		$.get(url).done(callback.ok).fail(callback.nok);
		console.log('Api.getItems@');
	};

	module.prototype.getItem = function(id, callback){
		console.log('@Api.getItem');
		var url = window.location.origin + '/api/item/' + id; 
		$.get(url).done(callback.ok).fail(callback.nok);
		console.log('Api.getItem@');
	};

	module.prototype.delItem = function(id, callback){
		console.log('@Api.eraseItem');

		var url = window.location.origin + '/api/item/' + id;
		$.ajax({
		    url: url,
		    type: 'DELETE',
		    success: callback.ok,
		    error: callback.nok
		}); 
		console.log('Api.eraseItem@');
	};


	return { module: module };

}());
