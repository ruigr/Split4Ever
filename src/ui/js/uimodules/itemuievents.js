
var ItemUiEvents = (function() {

	var module = function(name){
		base.Mod.call(this,name);
		this.configMap.events = [ 'uievents.view.categoryChanged' ];
		this.configMap.requires = ['utils', 'pubsub', 'constants', 'api' ];
		this.stateMap.categories = [];
		this.stateMap.subCategories = [];
		this.stateMap.parent = null;
		this.stateMap.model= { images : [] , category: null, subCategory: null };

	};

	module.prototype = Object.create(base.Mod.prototype);
	module.prototype.constructor = module;

    module.prototype.init = function(state){
    	this.configMap.modules['utils'].logger.enter(this.name, 'init');
    	//we receive the itemview statemap here
		this.stateMap.parent = state;
		this.setEvents();
    };
 
	module.prototype.setEvents = function(){

		this.loadData();
		this.setFilesWgtAction();
		this.setNameWgtAction();
		this.setAmountWgtAction();
		this.setNotesWgtAction();
		this.setCategoriesWgtAction();
		this.setSubCategoriesWgtAction();
		this.setRemoveWgtAction();
		this.setSubmitWgtAction();

	};

	module.prototype.emptySelect = function(wgt){
		for(var i = wgt.length - 1; i >= 0; i--)
			wgt.remove(i);
	};

	module.prototype.loadCombo = function(wgt, arr){

		this.emptySelect(wgt);
		for(var i=0; i < arr.length; i++){
			var option = document.createElement("option");
			var o = arr[i];
			option.text = o.name;
			wgt.add(option);
		}

	};

	module.prototype.loadCategoriesOnCombo = function(){

		var arr = [];
		arr.push( { name: this.configMap.modules['constants'].constant.noCategoryToken } );
		arr.push( { name: this.configMap.modules['constants'].constant.newCategoryToken } );
		Array.prototype.push.apply(arr,this.stateMap.categories);
		this.loadCombo(this.stateMap.parent.jqueryMap.$category, arr);
	};

	module.prototype.loadSubCategoriesOnCombo = function(categoryName){

		var arr = [];
		arr.push( { name: this.configMap.modules['constants'].constant.noCategoryToken } );

		if(null != categoryName){
			arr.push( { name: this.configMap.modules['constants'].constant.newSubCategoryToken } );
			for(var i=0; i < this.stateMap.subCategories.length; i++){
				var scat = this.stateMap.subCategories[i];
				if(scat.category === this.configMap.modules['constants'].constant.allClauseToken 
					|| scat.category === categoryName )
					arr.push(scat);
			}
		}
		this.loadCombo(this.stateMap.parent.jqueryMap.$subCategory, arr);

	};

	module.prototype.loadData = function(){

		var ccallback = function(mod){
			var module = mod;
				var ok = function(o){
					Array.prototype.push.apply(module.stateMap.categories,o);
					module.loadCategoriesOnCombo();
					module.loadSubCategoriesOnCombo(null);
					module.configMap.modules['utils'].logger.info(module.name, 'loaded categories: ' + o.length);
				};
				var nok = function(o){
					module.configMap.modules['utils'].logger.error(module.name, o);
				};
				return {ok: ok, nok: nok};
		}(this);

		var scallback = function(mod){
			var module = mod;
				var ok = function(o){
					Array.prototype.push.apply(module.stateMap.subCategories,o);
					module.configMap.modules['utils'].logger.info(module.name, 'loaded subCategories: ' + o.length);
				};
				var nok = function(o){
					module.configMap.modules['utils'].logger.error(module.name, o);
				};
				return {ok: ok, nok: nok};
		}(this);

		this.configMap.modules['api'].getCategories(ccallback);

		this.configMap.modules['api'].getSubCategories(scallback);
		

	};

	module.prototype.getCategoryByName = function(name) {
		var cat = null;

		for(var i = 0; i < this.stateMap.categories.length; i++ ){
			cat = this.stateMap.categories[i];
			if(cat.name == name.toLowerCase())
				break
		}
		return cat;
	};

	module.prototype.getSubCategoryByName = function(name) {
		var subcat = null;

		for(var i = 0; i < this.stateMap.subCategories.length; i++ ){
			subcat = this.stateMap.subCategories[i];
			if(subcat.name == name.toLowerCase())
				break
		}
		return subcat;
	};

	module.prototype.setSubCategoriesWgtAction = function() {

		var wgtListener = (function(module){
			var mod = module;

			var listen = function(wgt){

				var selectedCategory = mod.stateMap.parent.jqueryMap.$category.value;
				if( mod.configMap.modules['constants'].constant.newSubCategoryToken == wgt.value ){

					var newValue = prompt(mod.configMap.modules['constants'].constant.newSubCategoryPrompt, '');
					if(!newValue){//no selection
						mod.configMap.modules['pubsub'].publish('uievents.view.doRenderModel');
						return;
					}
					newValue = newValue.trim().toLowerCase();
					if( (0 < newValue.length) && (0 > module.stateMap.subCategories.indexOf(newValue)) ){
						var subcat = { name: newValue , category: selectedCategory};
						var callback = function(mod, sc){
							var module = mod;
							var scat = sc;
							var ok = function(o){
								var id = o.result;
								scat._id=id;
								//we update our list of categories 
								module.stateMap.subCategories.push(scat);
								//and ask for the controller to trigger an update to the model
								module.configMap.modules['pubsub'].publish('uievents.model.set.subCategory', scat);
							};
							var nok = function(o){
								module.configMap.modules['utils'].logger.error(module.name, o);
								module.configMap.modules['pubsub'].publish('uievents.view.doRenderModel');
							};
							return {ok: ok, nok: nok};
						}(mod, subcat);
						mod.configMap.modules['api'].setSubCategory(subcat, callback);
					}
					else if( mod.configMap.modules['constants'].constant.noSubCategoryToken === newValue ){
						mod.configMap.modules['pubsub'].publish('uievents.model.set.subCategory', null);
					}
				}
				else {
					var newValue = null;
					if(wgt.value != mod.configMap.modules['constants'].constant.noSubCategoryToken)
						newValue = mod.getSubCategoryByName(wgt.value);
					mod.configMap.modules['pubsub'].publish('uievents.model.set.subCategory', newValue);
				}
			};

			return {
				listen: listen
			};


		})(this);

		$( this.stateMap.parent.jqueryMap.$subCategory ).on('click', 
			function(){wgtListener.listen(this);}
		);

	};

	module.prototype.setCategoriesWgtAction = function() {

		var wgtListener = (function(module){
			var mod = module;

			var listen = function(wgt){

				if( mod.configMap.modules['constants'].constant.newCategoryToken == wgt.value ){

					var newValue = prompt(mod.configMap.modules['constants'].constant.newCategoryPrompt, '');

					if(!newValue){
						mod.configMap.modules['pubsub'].publish('uievents.view.doRenderModel');
						return;
					}
					newValue = newValue.trim().toLowerCase();
					if( (0 < newValue.length) && (0 > module.stateMap.categories.indexOf(newValue)) ){
						var cat = { name: newValue };
						var callback = function(mod, c){
							var module = mod;
							var category = c;
							var ok = function(o){
								var id = o.result;
								category._id=id;
								//we update our list of categories and reload the combo
								module.stateMap.categories.push(category);
								module.loadCategoriesOnCombo();
								//and ask for the controller to trigger an update to the model
								module.configMap.modules['pubsub'].publish('uievents.model.set.category', category);
							};
							var nok = function(o){
								module.configMap.modules['utils'].logger.error(module.name, o);
								module.configMap.modules['pubsub'].publish('uievents.view.doRenderModel');
							};
							return {ok: ok, nok: nok};
						}(mod, cat);
						mod.configMap.modules['api'].setCategory(cat, callback);
					}
					else if( mod.configMap.modules['constants'].constant.noCategoryToken === newValue ){
						mod.configMap.modules['pubsub'].publish('uievents.model.set.category', null);
					}
				}
				else {
					var newValue = null;
					if(wgt.value != mod.configMap.modules['constants'].constant.noCategoryToken)
						newValue = mod.getCategoryByName(wgt.value);
					mod.configMap.modules['pubsub'].publish('uievents.model.set.category', newValue);
				}
			};

			return {
				listen: listen
			};


		})(this);

		$( this.stateMap.parent.jqueryMap.$category ).on('click', 
			function(){wgtListener.listen(this);}
		);

	};

	module.prototype.setNotesWgtAction = function() {
		var wgtListener = (function(module){
			var mod = module;
			var listen = function(wgt){
				var value = wgt.value.trim();
				mod.configMap.modules['pubsub'].publish(
							'uievents.model.set.notes',value);
			};
			return { listen: listen };
		})(this);

		$( this.stateMap.parent.jqueryMap.$notes ).on('change', 
			function(){wgtListener.listen(this);}
		);
	};

	module.prototype.setAmountWgtAction = function() {
		
		var wgtListener = (function(module){
			var mod = module;
			var listen = function(wgt){
				var value = parseFloat(wgt.value.trim());
				mod.configMap.modules['pubsub'].publish(
							'uievents.model.set.price',value);
			};
			return { listen: listen };
		})(this);

		$( this.stateMap.parent.jqueryMap.$amount ).on('change', 
			function(){wgtListener.listen(this);}
		);
	};


	module.prototype.setNameWgtAction = function() {
		
		var wgtListener = (function(module){
			var mod = module;
			var listen = function(wgt){
				var value = wgt.value.trim();
				mod.configMap.modules['pubsub'].publish(
							'uievents.model.set.name',value);
			};
			return { listen: listen };

		})(this);

		$( this.stateMap.parent.jqueryMap.$name ).on('change', 
			function(){wgtListener.listen(this);}
		);
	};

	module.prototype.setFilesWgtAction = function() {
		
		var filesClick= function(filesWgt) {
			var wgt = filesWgt;
			var click = function(){
				wgt.click();
			};
			return {click: click};
		}(this.stateMap.parent.jqueryMap.$files);

		$( this.stateMap.parent.jqueryMap.$filesAdd ).on('click', filesClick.click );



		var filesDelClick= function(module) {
			var mod = module;
	
			var click = function(){

				if(confirm(mod.configMap.modules['constants'].constant.delFilesPrompt))
					mod.configMap.modules['pubsub'].publish( 'uievents.model.del.images', null);
			};
			return {click: click};
		}(this);

		$( this.stateMap.parent.jqueryMap.$filesDel ).on('click', filesDelClick.click );

		var wgtListener = (function(module){
			var mod = module;

			var FileReadCallBack = function(widget, m){
				var module = m;
				var wgt = widget;
				var totalNumOfObj = wgt.files.length;

				var callback = function(data, fileSelection){
					var image={};
					image.name=fileSelection.name;
					image.type=fileSelection.type;
					image.data = 'data:image/jpeg;base64,' + data;
					module.stateMap.model.images.push(image);
					if(totalNumOfObj == module.stateMap.model.images.length){
						//last image being loaded so tell everybody model has changed
						module.configMap.modules['pubsub'].publish(
							'uievents.model.set.images',
							module.stateMap.model.images);
					}
				};
				return { callback: callback};
			};

			var listen = function(wgt){
				//remove images
				mod.stateMap.model.images = [];
				//reload images in item
				for (var i=0; i < wgt.files.length;i++) {
					var selection = wgt.files[i];
					mod.configMap.modules['utils'].readFileAsBase64(selection, 
						FileReadCallBack(wgt, mod).callback);
				}
			};

			return {
				listen: listen
			};

		})(this);

		$( this.stateMap.parent.jqueryMap.$files ).on('change', 
			function(){wgtListener.listen(this);}
		);
	};

	module.prototype.setRemoveWgtAction = function() {
		
		var wgtListener = (function(module){
			var mod = module;
			var listen = function(wgt){
				mod.configMap.modules['pubsub'].publish( 'uievents.model.remove',null);
			};
			return { listen: listen };

		})(this);

		$( this.stateMap.parent.jqueryMap.$remove ).on('click', 
			function(){wgtListener.listen(this);}
		);
	};

	module.prototype.setSubmitWgtAction = function() {
		
		var wgtListener = (function(module){
			var mod = module;
			var listen = function(wgt){
				mod.configMap.modules['pubsub'].publish( 'uievents.model.persist',null);
			};
			return { listen: listen };

		})(this);

		$( this.stateMap.parent.jqueryMap.$submit ).on('click', 
			function(){wgtListener.listen(this);}
		);
	};

	module.prototype.onEvent = function(event, data){

		if( event == 'uievents.view.categoryChanged' ){
			if(data)
				this.loadSubCategoriesOnCombo(data.name);
			else
				this.loadSubCategoriesOnCombo(null);
		}
	
	};














/*


	module.prototype.onEvent = function(event, data){

		if( event == 'itemuievents.validstatus' ){
			this.widgetValidStatusSetter(data.widget, data.valid);
			this.checkUiValidity();
		}

		if( event == 'itemview.newCategoryAdded' ){
			
		}
	
	};

	

	module.prototype.filterSubCategories = function(category){

		var subcats = [];
		Array.prototype.push.apply(subcats, this.configMap.ctx.statemap.defaultSubCategories);
		for(var i = 0 ; i < this.configMap.ctx.statemap.subCategories.length; i++){
			var subcat = this.configMap.ctx.statemap.subCategories[i];
			if(subcat.category == category || subcat.category == '*')
				subcats.push(subcat);
		}

		wgt = this.configMap.ctx.statemap.jqueryMap.$subCategory;
		this.emptySelect(wgt);

		for(var i = 0; i < subcats.length; i++){
			var option = document.createElement("option");
			var subcat = subcats[i];
			option.text = subcat.name;
			wgt.add(option);
		}

	};

	

	

	


	




	



	*/

	return { module: module};

}());
