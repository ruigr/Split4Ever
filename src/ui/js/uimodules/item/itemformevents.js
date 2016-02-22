var ItemFormEvents = (function(){

	var module = function(name){

		base.UIMod.call(this,name);
		this.configMap.events = []; 
		this.configMap.requires = ['utils', 'constants', 'pubsub' ];
		this.configMap.uicontainer = null;
		this.stateMap.context = null;
	};

	var nameValidator = function(wgt, mod){
		var isValid = function(){

		};
		return {isValid: isValid};
	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.validateContext = function(){
		if(null == this.stateMap.context.jqueryMap)
			this.throw ("context must provide jqueryMap property");
		this.stateMap.jqueryMap = this.stateMap.context.jqueryMap;
	};

	module.prototype.setEvents = function(){
		this.validateContext();
		this.setNameWgtAction();
		this.setPriceWgtAction();
		this.setFilesWgtAction();
		this.setCategoriesWgtAction();
		this.setSubCategoriesWgtAction();
		this.setNotesWgtAction();
		this.setRemoveWgtAction();
		this.setSubmitWgtAction();
	};

	module.prototype.setRemoveWgtAction = function() {
		
		var wgtListener = (function(mod){
			var listen = function(wgt){
				mod.configMap.modules['pubsub'].publish('delete.item',null);
			};
			return { listen: listen };

		})(this);

		$( this.stateMap.jqueryMap.$remove ).on('click', function(){wgtListener.listen(this);} );
	};

	module.prototype.setSubmitWgtAction = function() {
		
		var wgtListener = (function(mod){
			var listen = function(wgt){
				mod.configMap.modules['pubsub'].publish( 'save.item',null);
			};
			return { listen: listen };

		})(this);

		$( this.stateMap.jqueryMap.$submit ).on('click', function(){wgtListener.listen(this);} );
	};

	module.prototype.setCategoriesWgtAction = function() {

		var wgtListener = (function(mod){

			var listen = function(wgt){
				var selectedValue = null
				if( mod.configMap.modules['constants'].constant.newCategoryToken == wgt.value ){
					var newValue = prompt(mod.configMap.modules['constants'].constant.newCategoryPrompt, '');
					if(newValue)
						selectedValue = newValue.trim().toLowerCase();
					else
						selectedValue = mod.stateMap.context.item.category;
				}
				else {
					if (wgt.value != mod.configMap.modules['constants'].constant.noCategoryToken) 
						selectedValue = wgt.value;
				}
				mod.configMap.modules['pubsub'].publish('update.item.category', selectedValue);

			};

			return {
				listen: listen
			};


		})(this);

		$( this.stateMap.jqueryMap.$category ).on('click',  function(){wgtListener.listen(this);} );

	};

	module.prototype.setSubCategoriesWgtAction = function() {

		var wgtListener = (function(mod){

			var listen = function(wgt){
				var selectedValue = null
				if( mod.configMap.modules['constants'].constant.newSubCategoryToken == wgt.value ){
					var newValue = prompt(mod.configMap.modules['constants'].constant.newSubCategoryPrompt, '');
					if(newValue)
						selectedValue = newValue.trim().toLowerCase();
					else
						selectedValue = mod.stateMap.context.item.subCategory;
				}
				else {
					if (wgt.value != mod.configMap.modules['constants'].constant.noSubCategoryToken) 
						selectedValue = wgt.value;
				}
				mod.configMap.modules['pubsub'].publish('update.item.subCategory', selectedValue);

			};

			return {
				listen: listen
			};


		})(this);

		$( this.stateMap.jqueryMap.$subCategory ).on('click',  function(){wgtListener.listen(this);} );

	};

	module.prototype.setFilesWgtAction = function() {
		
		var fileInputAction= function(wgt) {
			var invoke = function(){ wgt.click(); };
			return {invoke: invoke};
		}(this.stateMap.jqueryMap.$files);
		$( this.stateMap.jqueryMap.$filesAdd ).on('click', fileInputAction.invoke );


		var wgtListener = (function(mod){

			var FileReadCallBack = function(wgt, module){
				var totalNumOfObj = wgt.files.length;
				var filesReadSoFar = [];
				var callback = function(data, fileSelection){
					var imageData = 'data:image/jpeg;base64,' + data;
					filesReadSoFar.push(imageData);
					if(totalNumOfObj == filesReadSoFar.length)
						module.configMap.modules['pubsub'].publish( 'add.item.images', {files: filesReadSoFar});
				};
				return { callback: callback};
			};

			var listen = function(wgt){

				//reload images in item
				for (var i=0; i < wgt.files.length;i++) {
					var selection = wgt.files[i];
					mod.configMap.modules['utils'].readFileAsBase64(selection, FileReadCallBack(wgt, mod).callback);
				}
			};

			return {
				listen: listen
			};

		})(this);

		$( this.stateMap.jqueryMap.$files ).on('change', function(){ wgtListener.listen(this);} );
	};

	module.prototype.widgetValidStatusSetter = function(widget,status) {
		var formGroup = $( widget ).parents('.validation-aware').first();
		formGroup.removeClass("has-error");
		if(!status)
			formGroup.addClass("has-error");
	};

	module.prototype.validate = function(){

		var isValid = false;
		var jqmap = this.stateMap.jqueryMap;
		if(0 < $( jqmap.$col2 ).find('.has-error').length)
			isValid = false;
		else 
			isValid = true;

		return isValid;

	};

	module.prototype.setNameWgtAction = function() {
		
		var wgtListener = (function(mod){
			var listen = function(wgt){
				var value = wgt.value.trim();
				//check if widget is valid
				var valid=true;
				if(1 > value.length)
					valid = false;
				else if(value.length >= mod.configMap.modules['constants'].constant.nameMaxLength){
					value = value.substr(0, mod.configMap.modules['constants'].constant.nameMaxLength);
				}
				mod.widgetValidStatusSetter(wgt, valid);
				if(mod.validate() && valid && (null != mod.stateMap.context.item._id)){
					mod.stateMap.context.item.name = value;
					mod.configMap.modules['pubsub'].publish( 'persist.item');
				}

			};
			return { listen: listen };

		})(this);

		$( this.stateMap.jqueryMap.$name ).on('change', function(){wgtListener.listen(this);} );
	};

	module.prototype.setPriceWgtAction = function() {
		
		var wgtListener = (function(mod){
			var listen = function(wgt){
				var value = parseFloat(wgt.value.trim());
				var valid=true;
				if(1 > value.length)
					valid = false;
				mod.widgetValidStatusSetter(wgt, valid);
				if(mod.validate() && valid && (null != mod.stateMap.context.item._id)){
					mod.stateMap.context.item.name = value;
					mod.configMap.modules['pubsub'].publish( 'persist.item');
				}
				
			};
			return { listen: listen };
		})(this);

		$( this.stateMap.jqueryMap.$amount ).on('change', function(){wgtListener.listen(this);} );
	};
	module.prototype.setNotesWgtAction = function() {
		var wgtListener = (function(mod){
			var listen = function(wgt){
				var value = wgt.value.trim();
				mod.configMap.modules['pubsub'].publish( 'update.item.notes',value);
			};
			return { listen: listen };
		})(this);

		$( this.stateMap.jqueryMap.$notes ).on('change', function(){wgtListener.listen(this);} );
	};

	return { module: module };

}());
