/**
	ModelRender

	displays the model properties in the view widgets 
	and applies the view mode
*/
var ItemRender = (function() {

	var module = function(name){
		base.Mod.call(this,name);
		this.configMap.events = []; 
		this.configMap.requires = ['utils', 'pubsub', 'imagerender', 'constants'];
	};

	module.prototype = Object.create(base.Mod.prototype);
	module.prototype.constructor = module;

    module.prototype.init = function(statemap){
    	//we receive the itemview statemap here
		this.stateMap = statemap;
		this.applyMode();
    };
    
	module.prototype.applyMode = function(){

		var jqmap = this.stateMap.jqueryMap;
		var uimode = this.stateMap.mode;

		var editableWidgets = [ jqmap.$name,
				jqmap.$amount,
				jqmap.$notes,

				jqmap.$subCategory,
				jqmap.$category ];

		var actionWidgets = [ jqmap.$remove,
				jqmap.$submit, jqmap.$filesAdd, jqmap.$filesDel];

		for(var i = 0 ; i < editableWidgets.length ; i++ ){

			var widget = editableWidgets[i];
			if('edit' == uimode)
				$( widget ).removeAttr('disabled');
			else 
				$( widget ).attr('disabled', 'disabled');
			
		}

		for(var i = 0 ; i < actionWidgets.length ; i++ ){

			var widget = actionWidgets[i];
			if('edit' == uimode){
				$( widget ).show();
				$( widget ).attr('disabled', 'disabled');
			}
			else 
				$( widget ).hide();
			
		}

	};

	module.prototype.render = function(o){

		var jqmap = this.stateMap.jqueryMap;
		var uimode = this.stateMap.mode;

		jqmap.$name.value = o.name;
		jqmap.$amount.value = o.price;
		jqmap.$notes.value = o.notes;
		

		if(null != o.category)
			$( jqmap.$category ).val(o.category.name);

		//do a synchronous notification here
		this.configMap.modules['pubsub'].publish('uievents.view.categoryChanged', o.category, false);

		if(null != o.subCategory)
			$( jqmap.$subCategory ).val(o.subCategory.name);

		$( jqmap.$slideshow ).empty();

		if( null != o.images && (0 < o.images.length))
			this.configMap.modules['imagerender'].render(o.images, jqmap.$slideshow);

		if('edit' == uimode){

			$( jqmap.$filesAdd ).removeAttr('disabled');

			if( null != o.images && (0 < o.images.length))
				$( jqmap.$filesDel ).removeAttr('disabled');
			else
				$( jqmap.$filesDel ).attr('disabled', 'disabled');

			if(!o._id)//if we are creating new item then ui can't allow the removal
				$( jqmap.$remove ).attr('disabled', 'disabled');
			else
				$( jqmap.$remove ).removeAttr('disabled');
			//submit action only depends on ui validation
			if(this.valid())
				$( jqmap.$submit ).removeAttr('disabled');
			else
				$( jqmap.$submit ).attr('disabled', 'disabled');
		}
	};

	module.prototype.widgetValidStatusSetter = function(widget,status) {
		var formGroup = $( widget ).parents('.validation-aware').first();
		formGroup.removeClass("has-error");
		if(!status)
			formGroup.addClass("has-error");
	};

	module.prototype.valid = function(){

		this.checkUiValidity();
		var isValid = false;
		var jqmap = this.stateMap.jqueryMap;
		if(0 < $( jqmap.$col2 ).find('.has-error').length)
			isValid = false;
		else 
			isValid = true;

		return isValid;

	};

	module.prototype.checkUiValidity = function(){

		var jqmap = this.stateMap.jqueryMap;
		var wgt = null;
		var isValid = null;
		var value = null;

		//----name
		wgt = jqmap.$name;
		isValid = true;
		value = wgt.value.trim();
		if(1 > value.length)
			isValid = false;
		else if(value.length >= this.configMap.modules['constants'].constant.nameMaxLength){
			value = value.substr(0, this.configMap.modules['constants'].constant.nameMaxLength);
			wgt.value = value;
		}
		
		this.widgetValidStatusSetter(wgt, isValid);


		//----amount
		wgt = jqmap.$amount;
		isValid = false;
		value = parseFloat(wgt.value.trim());
		if((!isNaN(value)) && value <= this.configMap.modules['constants'].constant.amountMax) {
			isValid = true;
			wgt.value = value;
		}
		this.widgetValidStatusSetter(wgt, isValid);

		//----files
		/*wgt = jqmap.$files;
		isValid = (0 < wgt.files.length );
		this.widgetValidStatusSetter(wgt, isValid);*/

		//----notes
		wgt = jqmap.$notes;
		isValid = true;
		value = wgt.value.trim();
		if(1 > value.length)
			isValid = false;
		else if(value.length >= this.configMap.modules['constants'].constant.notesMaxLength){
			value = value.substr(0, this.configMap.modules['constants'].constant.notesMaxLength);
			wgt.value = value;
		}
		
		this.widgetValidStatusSetter(wgt, isValid);
		

	};
 
	

	return { module: module};

}());
