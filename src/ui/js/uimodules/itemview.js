var ItemView = (function(){

	var module = function(name){

		common.UIMod.call(this,name);
		this.configMap.events = []; 
		this.configMap.requires = ['utils', 'pubsub', 'api'
			, 'itemrender', 'itemuievents', 'constants'];
		this.configMap.uicontainer = null;
		this.stateMap.widget = null;
		this.stateMap.model = null; 
		this.stateMap.mode = null;

	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.initModule = function($container){
		this.configMap.modules['pubsub'].subscribe(this.configMap.events, this);
		
	};

	module.prototype.setJqueryMap = function(){

			this.stateMap.jqueryMap = {
				$container : this.configMap.uicontainer
				,$col1 : $(this.configMap.uicontainer).find('#col1')[0]
				,$col2 : $(this.configMap.uicontainer).find('#col2')[0]
				,$name : $(this.configMap.uicontainer).find('#inputName')[0]
				,$amount : $(this.configMap.uicontainer).find('#inputAmount')[0]
				,$notes : $(this.configMap.uicontainer).find('#inputNotes')[0]
				,$filesAdd : $(this.configMap.uicontainer).find('#filesAction')[0]
				,$filesDel : $(this.configMap.uicontainer).find('#filesDelAction')[0]
				,$files : $(this.configMap.uicontainer).find('#inputFiles')[0]
				,$remove : $(this.configMap.uicontainer).find('#remove')[0]
				,$submit : $(this.configMap.uicontainer).find('#submit')[0]
				,$category : $(this.configMap.uicontainer).find('#comboCat')[0]
				,$subCategory : $(this.configMap.uicontainer).find('#comboSubCat')[0]
				,$slideshow : $(this.configMap.uicontainer).find('#slideshow')[0]
			};

	};

	module.prototype.render = function(o){
		this.configMap.modules['itemrender'].render(o);
		
	};

	module.prototype.init = function($container, mode){
		this.configMap.uicontainer = $container;
		this.stateMap.mode = mode;
		this.initUi();
		this.setJqueryMap();
		this.configMap.modules['itemrender'].init(this.stateMap);
		this.configMap.modules['itemuievents'].init(this.stateMap);
	};

	module.prototype.initUi = function(){

		var col1 = document.createElement("div");
		$( this.configMap.uicontainer ).append(col1);
		col1.classList.add("col-sm-12");
		col1.classList.add("col-md-6");
		col1.setAttribute('id', 'col1');

		var col2 = document.createElement("div");
		$( this.configMap.uicontainer ).append(col2);
		col2.classList.add("col-sm-12");
		col2.classList.add("col-md-6");
		col2.setAttribute('id', 'col2');

		var thumbWrapper = document.createElement("div");
		col1.appendChild(thumbWrapper);
		thumbWrapper.classList.add("thumbnail");
		thumbWrapper.classList.add("thumbnail-fix-2");
		
		var slideshow = document.createElement("div");
		thumbWrapper.appendChild(slideshow);
		slideshow.classList.add("slideshow");
		slideshow.setAttribute('id', 'slideshow');

		var form = document.createElement("form");
		col2.appendChild(form);
		form.classList.add("form-horizontal");
		var nameGroup = document.createElement("div");
		form.appendChild(nameGroup);
		nameGroup.classList.add("form-group");
		nameGroup.classList.add("validation-aware");
		
		var nameLabel = document.createElement("label");
		nameGroup.appendChild(nameLabel);
		nameLabel.setAttribute('for', 'inputName');
		nameLabel.classList.add("col-sm-2");
		nameLabel.classList.add("control-label");
		nameLabel.innerText = 'name';

		var namediv = document.createElement("div");
		nameGroup.appendChild(namediv);
		namediv.classList.add("col-sm-10");
		var nameInput = document.createElement("input");
		namediv.appendChild(nameInput);
		nameInput.classList.add("form-control");
		nameInput.setAttribute('type', 'text');
		nameInput.setAttribute('id', 'inputName');
		nameInput.setAttribute('placeholder', 'part name');
		nameInput.setAttribute('maxlength', this.configMap.modules['constants'].constant.nameMaxLength);

		var amountAndFileGroup = document.createElement("div");
		form.appendChild(amountAndFileGroup);
		amountAndFileGroup.classList.add("form-group");

		var amountGroup = document.createElement("div");
		amountAndFileGroup.appendChild(amountGroup);
		amountGroup.classList.add("validation-aware");

		var amountLabel = document.createElement("label");
		amountGroup.appendChild(amountLabel);
		amountLabel.setAttribute('for', 'inputAmount');
		amountLabel.classList.add("col-sm-2");
		amountLabel.classList.add("control-label");
		amountLabel.innerText = '€';

		var amountdiv = document.createElement("div");
		amountGroup.appendChild(amountdiv);
		amountdiv.classList.add("col-sm-4");

		var amountInput = document.createElement("input");
		amountdiv.appendChild(amountInput);
		amountInput.classList.add("form-control");
		amountInput.setAttribute('type', 'number');
		amountInput.setAttribute('id', 'inputAmount');
		amountInput.setAttribute('placeholder', 'amount');
		amountInput.setAttribute('min', 0);
		amountInput.setAttribute('max', this.configMap.modules['constants'].constant.amountMax);

		var fileGroup = document.createElement("div");
		amountAndFileGroup.appendChild(fileGroup);

		var filesInputdiv = document.createElement("div");
		fileGroup.appendChild(filesInputdiv);
		filesInputdiv.classList.add("col-sm-1");

		var filesInput = document.createElement("input");
		filesInputdiv.appendChild(filesInput);
		filesInput.classList.add("form-control");
		filesInput.setAttribute('type', 'file');
		filesInput.setAttribute('id', 'inputFiles');
		filesInput.setAttribute('accept', 'image/*');
		filesInput.setAttribute('multiple', 'true');
		filesInput.setAttribute('style', 'visibility: hidden;');

		var filesButtondiv = document.createElement("div");
		fileGroup.appendChild(filesButtondiv);
		filesButtondiv.classList.add("col-sm-2");
		filesButtondiv.classList.add("pull-right");

		var filesButton = document.createElement("button");
		filesButtondiv.appendChild(filesButton);
		filesButton.classList.add("btn");
		filesButton.classList.add("btn-default");
		filesButton.setAttribute('id', 'filesAction');
		filesButton.classList.add("pull-right");
		filesButton.setAttribute('type', 'submit');
		filesButton.innerText = 'define files';


		var filesDelButtondiv = document.createElement("div");
		fileGroup.appendChild(filesDelButtondiv);
		filesDelButtondiv.classList.add("col-sm-2");
		filesDelButtondiv.classList.add("pull-right");
		

		var filesDelButton = document.createElement("button");
		filesDelButtondiv.appendChild(filesDelButton);
		filesDelButton.classList.add("btn");
		filesDelButton.classList.add("btn-default");
		filesDelButton.setAttribute('id', 'filesDelAction');
		filesDelButton.classList.add("pull-right");
		filesDelButton.setAttribute('type', 'submit');
		filesDelButton.innerText = 'delete files';


		var categoriesGroup = document.createElement("div");
		form.appendChild(categoriesGroup);
		categoriesGroup.classList.add("form-group");

		var catLabel = document.createElement("label");
		categoriesGroup.appendChild(catLabel);
		catLabel.setAttribute('for', 'comboCat');
		catLabel.classList.add("col-sm-2");
		catLabel.classList.add("control-label");
		catLabel.innerText = 'category';

		var catdiv = document.createElement("div");
		categoriesGroup.appendChild(catdiv);
		catdiv.classList.add("col-sm-4");

		var comboCat = document.createElement("select");
		catdiv.appendChild(comboCat);
		comboCat.classList.add("form-control");
		comboCat.setAttribute('id', 'comboCat');
		comboCat.setAttribute('placeholder', '...');


		var subcatLabel = document.createElement("label");
		categoriesGroup.appendChild(subcatLabel);
		subcatLabel.setAttribute('for', 'comboSubCat');
		subcatLabel.classList.add("col-sm-2");
		subcatLabel.classList.add("control-label");
		subcatLabel.innerText = 'subcategory';

		var subcatdiv = document.createElement("div");
		categoriesGroup.appendChild(subcatdiv);
		subcatdiv.classList.add("col-sm-4");

		var comboSubCat = document.createElement("select");
		subcatdiv.appendChild(comboSubCat);
		comboSubCat.classList.add("form-control");
		comboSubCat.setAttribute('id', 'comboSubCat');
		comboSubCat.setAttribute('placeholder', '...');

		var notesGroup = document.createElement("div");
		form.appendChild(notesGroup);
		notesGroup.classList.add("form-group");
		notesGroup.classList.add("validation-aware");

		var notesLabel = document.createElement("label");
		notesGroup.appendChild(notesLabel);
		notesLabel.setAttribute('for', 'inputNotes');
		notesLabel.classList.add("col-sm-2");
		notesLabel.classList.add("control-label");
		notesLabel.innerText = 'notes';

		var notesdiv = document.createElement("div");
		notesGroup.appendChild(notesdiv);
		notesdiv.classList.add("col-sm-10");

		var notesText = document.createElement("textarea");
		notesdiv.appendChild(notesText);
		notesText.classList.add("form-control");
		notesText.setAttribute('rows', '6');
		notesText.setAttribute('id', 'inputNotes');
		notesText.setAttribute('placeholder', '...notes...');
		notesText.setAttribute('maxlength', this.configMap.modules['constants'].constant.notesMaxLength);

		var buttonGroup = document.createElement("div");
		form.appendChild(buttonGroup);
		buttonGroup.classList.add("form-group");

		var removediv = document.createElement("div");
		buttonGroup.appendChild(removediv);
		removediv.classList.add("col-sm-offset-8");
		removediv.classList.add("col-sm-2");
		
		var removeButton = document.createElement("button");
		removediv.appendChild(removeButton);
		removeButton.classList.add("btn");
		removeButton.classList.add("btn-default");
		removeButton.classList.add("pull-right");
		removeButton.setAttribute('id', 'remove');
		removeButton.setAttribute('type', 'submit');
		removeButton.innerText = 'remove';

		var submitdiv = document.createElement("div");
		buttonGroup.appendChild(submitdiv);
		submitdiv.classList.add("col-sm-2");
		
		var submitButton = document.createElement("button");
		submitdiv.appendChild(submitButton);
		submitButton.classList.add("btn");
		submitButton.classList.add("btn-default");
		submitButton.classList.add("pull-right");
		submitButton.setAttribute('id', 'submit');
		submitButton.setAttribute('type', 'submit');
		submitButton.innerText = 'submit';
	};




	return { module: module };

}());
