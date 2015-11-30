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
		base.Mod.call(this,name);
		this.configMap.constants = {
			NOT_APPLICABLE: 'NA'
		};
	};

	module.prototype = Object.create(base.Mod.prototype);
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

		console.log('Api.setItem@');

	};



	module.prototype.getItems = function(callback){
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

	module.prototype.getImage = function(id, callback){
		console.log('@Api.getImage');
		var url = window.location.origin + '/api/image/' + id;
		$.get(url).done(callback.ok).fail(callback.nok);
		console.log('Api.getImage@');
	};

	module.prototype.setImage = function(o, callback){

		console.log('@Api.setImage');
		console.log('category: ' + JSON.stringify(o));
		var url = window.location.origin + '/api/image'; 

		$.ajax({
			async:true,
		    url: url,
		    data: o,
		    type: 'POST',
		    success: callback.ok,
		    dataType: 'json',
		    error: callback.nok
		});

		console.log('Api.setImage@');

	};

	module.prototype.getCategories = function(callback){
		console.log('@Api.getCategories');
		var url = window.location.origin + '/api/categories'; 
		$.get(url).done(callback.ok).fail(callback.nok);
		console.log('Api.getCategories@');
	};

	module.prototype.getSubCategories = function(callback){
		console.log('@Api.getSubCategories');
		var url = window.location.origin + '/api/subCategories'; 
		$.get(url).done(callback.ok).fail(callback.nok);
		console.log('Api.getSubCategories@');
	};


	module.prototype.setCategory = function(o, callback){

		console.log('@Api.setCategory');
		console.log('category: ' + JSON.stringify(o));
		var url = window.location.origin + '/api/categories'; 

		$.ajax({
			async:true,
		    url: url,
		    data: o,
		    type: 'POST',
		    success: callback.ok,
		    dataType: 'json',
		    error: callback.nok
		});

		console.log('Api.setCategory@');

	};

	module.prototype.setSubCategory = function(o, callback){

		console.log('@Api.setSubCategory');
		console.log('subCategory: ' + JSON.stringify(o));
		var url = window.location.origin + '/api/subCategories'; 

		$.ajax({
			async:true,
		    url: url,
		    data: o,
		    type: 'POST',
		    success: callback.ok,
		    dataType: 'json',
		    error: callback.nok
		});

		console.log('Api.setSubCategory@');

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
