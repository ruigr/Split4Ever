var ItemFormLoader = (function(){

	var module = function(name){

		base.UIMod.call(this,name);
		this.configMap.events = []; 
		this.configMap.requires = ['utils', 'constants', 'api', 'categorycache' ];
		this.configMap.uicontainer = null;
		this.stateMap.context = null;
	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.validateContext = function(){
		if(null == this.stateMap.context.item)
			this.throw ("context must provide item property");
		if(null == this.stateMap.context.mode)
			this.throw ("context must provide mode property");
		if(null == this.stateMap.context.jqueryMap)
			this.throw ("context must provide jqueryMap property");
	};

	module.prototype.categoryLoader = function(mod, wgt, item, errMsg) {
		var ok = function(o){
			var entries = [];
			entries.push({ name: mod.configMap.modules['constants'].constant.noCategoryToken });
			entries.push({ name: mod.configMap.modules['constants'].constant.newCategoryToken });
			for(var i = 0; i < o.length; i++)
				entries.push(o[i]);

			mod.loadCombo(wgt, entries);
			if( null != item.category && null != item.category.name && item.category.name.length > 0)
				$( wgt ).val(item.category.name);
			else
				$( wgt ).val(mod.configMap.modules['constants'].constant.noCategoryToken);
			
		};
		var nok = function(err){
			mod.configMap.modules['utils'].logger.error(mod.name, errMsg + err);
		};

		return {
			ok : ok, nok: nok
		};
	};

	module.prototype.subCategoryLoader = function(mod, wgt, item, errMsg) {
		var ok = function(o){
			var entries = [];

			entries.push({ name: mod.configMap.modules['constants'].constant.noSubCategoryToken });
			if(null != item.category && item.category.length > 0){
				entries.push({ name: mod.configMap.modules['constants'].constant.newSubCategoryToken , category: mod.configMap.modules['constants'].constant.allClauseToken});
				for(var i = 0; i < o.length; i++){
					if(o[i].category.name == item.category.name || o[i].category.name == mod.configMap.modules['constants'].constant.allClauseToken)
						entries.push(o[i]);
				}
			}
			mod.loadCombo(wgt, entries);
			if( null != item.subCategory && null != item.subCategory.name && item.subCategory.name.length > 0)
				$( wgt ).val(item.subCategory.name);
			else
				$( wgt ).val(mod.configMap.modules['constants'].constant.noSubCategoryToken);

		};
		var nok = function(err){
			mod.configMap.modules['utils'].logger.error(mod.name, errMsg + err);
		};

		return {
			ok : ok, nok: nok
		};
	};

	module.prototype.load = function(){
		this.validateContext();



		this.stateMap.context.jqueryMap.$id.value = this.stateMap.context.item._id;
		this.stateMap.context.jqueryMap.$name.value = this.stateMap.context.item.name;
		this.stateMap.context.jqueryMap.$amount.value = this.stateMap.context.item.price;
		this.stateMap.context.jqueryMap.$notes.value = this.stateMap.context.item.notes;

		this.configMap.modules['api'].getCategories(this.categoryLoader(
			this, this.stateMap.context.jqueryMap.$category, this.stateMap.context.item, 
			'couldnt load categories: '));
		this.configMap.modules['api'].getSubCategories(this.subCategoryLoader(
			this, this.stateMap.context.jqueryMap.$subCategory, this.stateMap.context.item, 
			'couldnt load subCategories: '));


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

	 

	return { module: module };

}());

