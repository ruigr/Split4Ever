var ItemFormWidget = (function(){

	var module = function(name){

		base.UIMod.call(this,name);
		this.configMap.events = []; 
		this.configMap.requires = ['utils', 'constants', 'categorycache' ];
		this.configMap.uicontainer = null;
		this.stateMap.context = null;
	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.setJqueryMap = function(){

			this.stateMap.jqueryMap = {
				$container : this.configMap.uicontainer
				,$col1 : $(this.configMap.uicontainer).find('#col1')[0]
				,$col2 : $(this.configMap.uicontainer).find('#col2')[0]
				,$name : $(this.configMap.uicontainer).find('#inputName')[0]
				,$amount : $(this.configMap.uicontainer).find('#inputAmount')[0]
				,$notes : $(this.configMap.uicontainer).find('#inputNotes')[0]
				,$filesAdd : $(this.configMap.uicontainer).find('#filesAction')[0]
				,$files : $(this.configMap.uicontainer).find('#inputFiles')[0]
				,$id : $(this.configMap.uicontainer).find('#_id')[0]
				,$remove : $(this.configMap.uicontainer).find('#remove')[0]
				,$submit : $(this.configMap.uicontainer).find('#submit')[0]
				,$category : $(this.configMap.uicontainer).find('#comboCat')[0]
				,$subCategory : $(this.configMap.uicontainer).find('#comboSubCat')[0]
				,$slideshow : $(this.configMap.uicontainer).find('#slideshow')[0]
			};

	};

	module.prototype.emptySelect = function(wgt){
		for(var i = wgt.length - 1; i >= 0; i--)
			wgt.remove(i);
	};

	module.prototype.loadCombo = function(wgt, arr){

		//this.emptySelect(wgt);
		for(var i = wgt.length - 1; i >= 0; i--)
			wgt.remove(i);

		for(var i=0; i < arr.length; i++){
			var option = document.createElement("option");
			var o = arr[i];
			option.text = o.name;
			wgt.add(option);
		}

	};

	module.prototype.loadCombos = function(){
		
		var comboLoader = function(wgt, mod){
			var widget = wgt;
			var m =  mod;
			var load = function(cats){
				m.loadCombo(widget, cats);
			};

			return { load: load}
		};

		this.configMap.modules['utils'].async(
			this.configMap.modules['categorycache'].getCategories, 
			comboLoader(this.stateMap.jqueryMap.$category, this).load);
		this.configMap.modules['utils'].async(
			this.configMap.modules['categorycache'].getSubCategories, 
			comboLoader(this.stateMap.jqueryMap.$subCategory, this).load);
	};

	module.prototype.initUI = function(){

		this.validateContext(this.stateMap.context);
		this.configMap.uicontainer = this.stateMap.context.container;

		var col1 = this.configMap.modules['utils'].createElement('div',["col-sm-12","col-md-6" ], [{ name: 'id', value: 'col1' }]);
		$( this.configMap.uicontainer ).append(col1);
		var col2 = this.configMap.modules['utils'].createElement('div',["col-sm-12","col-md-6" ], [{ name: 'id', value: 'col2' }]);
		$( this.configMap.uicontainer ).append(col2);

/*		var thumbWrapper = this.configMap.modules['utils'].createElement('div',["thumbnail","thumbnail-fix-2"]);
		col1.appendChild(thumbWrapper);
		var slideshow = this.configMap.modules['utils'].createElement('div',["slideshow" ], [{ name: 'id', value: 'slideshow' }]);
		thumbWrapper.appendChild(slideshow);*/

		var form = this.configMap.modules['utils'].createElement('form',["form-horizontal"]);
		col2.appendChild(form);
		var nameGroup = this.configMap.modules['utils'].createElement('div',["form-group", "validation-aware"]);
		form.appendChild(nameGroup);
		var nameLabel = this.configMap.modules['utils'].createElement('label',["col-sm-2", "control-label"], [{ name: 'for', value: 'inputName' }]);
		nameGroup.appendChild(nameLabel);
		nameLabel.innerText = 'name';
		var namediv = this.configMap.modules['utils'].createElement('div',["col-sm-10"]);
		nameGroup.appendChild(namediv);
		var nameInput = this.configMap.modules['utils'].createElement('input',["form-control"], [{ name: 'type', value: 'text' }, { name: 'id', value: 'inputName' }, { name: 'placeholder', value: 'part name' }, { name: 'maxlength', value: this.configMap.modules['constants'].constant.nameMaxLength }]);
		namediv.appendChild(nameInput);
		
		var amountAndFileGroup = this.configMap.modules['utils'].createElement('div',["form-group"]);
		form.appendChild(amountAndFileGroup);

		var amountGroup = this.configMap.modules['utils'].createElement('div',["validation-aware"]);
		amountAndFileGroup.appendChild(amountGroup);
		var amountLabel = this.configMap.modules['utils'].createElement('label',["col-sm-2", "control-label"], [{ name: 'for', value: 'inputAmount' }]);
		amountGroup.appendChild(amountLabel);
		amountLabel.innerText = '€';
		var amountdiv = this.configMap.modules['utils'].createElement('div',["col-sm-4"]);
		amountGroup.appendChild(amountdiv);
		var amountInput = this.configMap.modules['utils'].createElement('input',["form-control"], [{ name: 'type', value: 'number' }, { name: 'id', value: 'inputAmount' }, { name: 'placeholder', value: 'amount' }, { name: 'min', value: 0 }, { name: 'max', value: this.configMap.modules['constants'].constant.amountMax }]);
		amountdiv.appendChild(amountInput);

		var fileGroup = this.configMap.modules['utils'].createElement('div');
		amountAndFileGroup.appendChild(fileGroup);
		var filesInputdiv = this.configMap.modules['utils'].createElement('div',["col-sm-1"]);
		fileGroup.appendChild(filesInputdiv);
		var filesInput = this.configMap.modules['utils'].createElement('input',["form-control"], [{ name: 'type', value: 'file' }, { name: 'id', value: 'inputFiles' }, 
				{ name: 'accept', value: 'image/*' }, { name: 'multiple', value: 'true' }, { name: 'style', value: 'visibility: hidden;' }]);	
		filesInputdiv.appendChild(filesInput);
		var filesButtondiv = this.configMap.modules['utils'].createElement('div',["col-sm-4", "pull-right"]);
		fileGroup.appendChild(filesButtondiv);
		var filesButton = this.configMap.modules['utils'].createElement('button',["btn", "btn-default", "form-control","pull-right"], [{ name: 'type', value: 'submit' }, { name: 'id', value: 'filesAction' }]);	
		filesButtondiv.appendChild(filesButton);
		filesButton.innerText = 'add files';
		
		var hiddenIddiv = this.configMap.modules['utils'].createElement('div',["col-sm-1", "pull-right"]);
		fileGroup.appendChild(hiddenIddiv);
		var idInput = this.configMap.modules['utils'].createElement('input',["form-control"], [{ name: 'type', value: 'text' }, { name: 'id', value: '_id' }, { name: 'style', value: 'visibility: hidden;' } ]);
		hiddenIddiv.appendChild(idInput);

		var categoriesGroup = this.configMap.modules['utils'].createElement('div',["form-group"]);
		form.appendChild(categoriesGroup);
		var catLabel = this.configMap.modules['utils'].createElement('label',["col-sm-2", "control-label"], [{ name: 'for', value: 'comboCat' }]);
		categoriesGroup.appendChild(catLabel);
		catLabel.innerText = 'category';
		var catdiv = this.configMap.modules['utils'].createElement('div',["col-sm-4"]);
		categoriesGroup.appendChild(catdiv);
		var comboCat = this.configMap.modules['utils'].createElement('select',["form-control"], [{ name: 'id', value: 'comboCat' }, { name: 'placeholder', value: '...' }]);
		catdiv.appendChild(comboCat);
		var subcatLabel = this.configMap.modules['utils'].createElement('label',["col-sm-2", "control-label"], [{ name: 'for', value: 'comboSubCat' }]);
		categoriesGroup.appendChild(subcatLabel);
		subcatLabel.innerText = 'subcategory';
		var subcatdiv = this.configMap.modules['utils'].createElement('div',["col-sm-4"]);
		categoriesGroup.appendChild(subcatdiv);
		var comboSubCat = this.configMap.modules['utils'].createElement('select',["form-control"], [{ name: 'id', value: 'comboSubCat' }, { name: 'placeholder', value: '...' }]);
		subcatdiv.appendChild(comboSubCat);
		var notesGroup = this.configMap.modules['utils'].createElement('div',["form-group", "validation-aware"]);
		form.appendChild(notesGroup);
		var notesLabel = this.configMap.modules['utils'].createElement('label',["col-sm-2", "control-label"], [{ name: 'for', value: 'inputNotes' }]);
		notesGroup.appendChild(notesLabel);
		notesLabel.innerText = 'notes';
		var notesdiv = this.configMap.modules['utils'].createElement('div',["col-sm-10"]);
		notesGroup.appendChild(notesdiv);
		var notesText = this.configMap.modules['utils'].createElement('textarea',["form-control"], [{ name: 'id', value: 'inputNotes' }, { name: 'placeholder', value: '...notes...' }, 
			{ name: 'rows', value: '6' }, { name: 'maxlength', value: this.configMap.modules['constants'].constant.notesMaxLength }]);
		notesdiv.appendChild(notesText);
		var buttonGroup = this.configMap.modules['utils'].createElement('div',["form-group"]);
		form.appendChild(buttonGroup);
		var removediv = this.configMap.modules['utils'].createElement('div',["col-sm-offset-8", "col-sm-2"]);
		buttonGroup.appendChild(removediv);
		var removeButton = this.configMap.modules['utils'].createElement('button',["btn", "btn-default", "pull-right"], [{ name: 'type', value: 'submit' },{ name: 'id', value: 'remove' } ]);
		removediv.appendChild(removeButton);
		removeButton.innerText = 'remove';
		var submitdiv = this.configMap.modules['utils'].createElement('div',["col-sm-2"]);
		buttonGroup.appendChild(submitdiv);
		var submitButton = this.configMap.modules['utils'].createElement('button',["btn", "btn-default", "pull-right"], [{ name: 'type', value: 'submit' },{ name: 'id', value: 'submit' } ]);
		submitdiv.appendChild(submitButton);
		submitButton.innerText = 'submit';

		this.setJqueryMap();

		this.loadCombos();
	};

	

	return { module: module };

}());
