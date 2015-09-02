var Api = (function(){
	/*	
		item: {
			_id: null,
			images:[],
			name: '',
			notes: '',
			price: ''
		}
	*/
	var module = function(name){
		common.Mod.call(this,name);
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.setItem = function(item, callback){

		console.log('@Api.setItem');
		console.log('item: ' + JSON.stringify(item));
		var url = window.location.origin + '/api/item'; 

		$.ajax({
			async:true,
		    url: url,
		    data: item,
		    type: 'POST',
		    success: callback.ok,
		    dataType: 'json',
		    error: callback.nok
		});


/*		var posting = $.post(url, item);
		posting.done(callback.ok);
		posting.fail(callback.nok);*/
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

	module.prototype.getCategories = function(callback){
		console.log('@Api.getCategories');
		//var url = window.location.origin + '/api/item/' + id; 
		//$.get(url).done(callback.ok).fail(callback.nok);
		var data = [];
		
		callback.ok(data);

		console.log('Api.getCategories@');
	};

	module.prototype.getSubCategories = function(cat, callback){
		console.log('@Api.getSubCategories');
		//var url = window.location.origin + '/api/item/' + id; 
		//$.get(url).done(callback.ok).fail(callback.nok);
		var data = [];
		
		callback.ok(data);
		
		console.log('Api.getSubCategories@');
	};

	module.prototype.delItem = function(id, callback){
		console.log('@Api.eraseItem');

		var url = window.location.origin + '/api/item/' + id;
		$.ajax({
			async:true,
		    url: url,
		    type: 'DELETE',
		    success: callback.ok,
		    dataType: 'json',
		    error: callback.nok
		}); 
		console.log('Api.eraseItem@');
	};


	return { module: module };

}());
