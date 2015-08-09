var ItemUI = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.active = false;
		this.configMap.events = ['itemuiValid']; 
		this.configMap.requires = ['utils', 'pubsub'];
		this.configMap.constants = {
			nameMaxLength: 128,
			amountMax: 999999,
			notesMaxLength: 1024
		};
		this.stateMap.item = {
				_id: null,
				images:[],
				name: '',
				notes: '',
				price: ''
			}; 
		
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.initModule = function($container){
		this.configMap.modules['pubsub'].subscribe(this.configMap.events, this);
		this.configMap.uicontainer = null;
	};

	module.prototype.setJqueryMap = function(){
			this.stateMap.jqueryMap = {
				$container : this.configMap.uicontainer
				,$col1 : $(this.configMap.uicontainer).find('#col1')
				,$col2 : $(this.configMap.uicontainer).find('#col2')
				,$name: $(col2).find('#inputName')[0]
				,$amount: $(col2).find('#inputAmount')[0]
				,$notes: $(col2).find('#inputNotes')[0]
				,$files: $(col2).find('#inputFiles')[0]
				,$remove: $(col2).find('#remove')[0]
				,$submit: $(col2).find('#submit')[0]

			};
	};

	module.prototype.checkUiValidity = function(){


		if(0 < this.stateMap.jqueryMap.$col2.find('.has-error').length){
			$( this.stateMap.jqueryMap.$submit ).attr('disabled', 'disabled');
			//$( this.stateMap.jqueryMap.$remove ).attr('disabled', 'disabled');
		}
		else {
			$( this.stateMap.jqueryMap.$submit ).removeAttr('disabled');
			//$( this.stateMap.jqueryMap.$remove ).removeAttr('disabled');
		}


	}
	module.prototype.widgetValidStatusSetter = function(widget,status) {
		var formGroup = $( widget ).parents('.form-group');
		formGroup.removeClass("has-error");
		if(!status)
			formGroup.addClass("has-error");
	};

	module.prototype.setEvents = function(){

		//---------------------------------files widget
		var filesWgtListener = (function(stateMap, utilsModule, thisMod){
			
			var statemap = stateMap;
			var utils = utilsModule;
			var module = thisMod;
			var statusSetter = thisMod.widgetValidStatusSetter;

			var validate = function(wgt){
				var result = false;

				if(0 < wgt.value.length)
					result = true;

				return result;
			};

			var FileReadCallBack = function(numObjectsBeingLoaded, stateMap){
				var statemap = stateMap;
				var totalNumOfObj = numObjectsBeingLoaded;

				var callback = function(data, fileSelection){
					var image={};
					image.name=fileSelection.name;
					image.type=fileSelection.type;
					image.data = 'data:image/jpeg;base64,' + data;
					statemap.item.images.push(image);
					if(totalNumOfObj == statemap.item.images.length)
						module.loadItemImages(statemap.item, statemap.jqueryMap.$col1[0]) ;

				};
				return { callback: callback};
			};

			var updateModelImages = function(widget){
				//remove images
				statemap.item.images = [];
				$( statemap.jqueryMap.$col1 ).empty();
				//reload images in item
				for (var i=0; i < widget.files.length;i++) {
					var selection = widget.files[i];
					console.log('new file selection:' + selection.name);
					
					utils.readFileAsBase64(selection, FileReadCallBack(widget.files.length, statemap).callback);
				}
			};

			var listen = function(widget){
				var doCheck = true;
				if((0 == widget.value.length) && (0 < statemap.item.images.length)){
					//if we are editing and if no selection then assume everything's ok
					doCheck = false;
				}
				if(doCheck){
					if(!validate(widget))
						statusSetter(widget, false);
					else{
						statusSetter(widget, true);
						updateModelImages(widget);
					}	
				}
				module.checkUiValidity();
			};



			return {
				listen: listen
			};

		})(this.stateMap, this.configMap.modules['utils'], this);

		

		$( this.stateMap.jqueryMap.$files ).on('change', 
			function(){filesWgtListener.listen(this);}
		);

		//---------------------------------name widget

		var nameWgtListener = (function(stateMap, configMap, thisMod){
			var statemap = stateMap;
			var configmap = configMap;
			var module = thisMod;
			var statusSetter = thisMod.widgetValidStatusSetter;

			var validate = function(wgt){
				var result = false;

				if(0 < wgt.value.length ){
					var value = wgt.value.trim();
					if(0 < value.length && value.length < configmap.constants.nameMaxLength){
						wgt.value = value;
						result = true;
					}

				}

				return result;
			};

			var listen = function(widget){
				if(!validate(widget))
					statusSetter(widget, false);
				else{
					statusSetter(widget, true);
					statemap.item.name = widget.value.trim();
				}
				module.checkUiValidity();
			};

			return {
				listen: listen
			};


		})(this.stateMap, this.configMap, this);

		$( this.stateMap.jqueryMap.$name ).on('change', 
			function(){nameWgtListener.listen(this);}
		);
		
		//---------------------------------amount widget

		var amountWgtListener = (function(stateMap, configMap, thisMod){
			var statemap = stateMap;
			var configmap = configMap;
			var module = thisMod;
			var statusSetter = thisMod.widgetValidStatusSetter;

			var validate = function(wgt){
				var result = false;

				if(0 < wgt.value.length && 0 < wgt.value.trim().length){
					var value = parseFloat(wgt.value.trim());
					if((!isNaN(value)) && value <= configmap.constants.amountMax){
						result = true;
						wgt.value = value;
					}

				}

				return result;
			};

			var listen = function(widget){
				if(!validate(widget))
					statusSetter(widget, false);
				else{
					statusSetter(widget, true);
					statemap.item.price = parseFloat(widget.value.trim());
				}
				module.checkUiValidity();
			};

			return {
				listen: listen
			};


		})(this.stateMap, this.configMap, this);

		$( this.stateMap.jqueryMap.$amount ).on('change', 
			function(){amountWgtListener.listen(this);}
		);

		//---------------------------------notes widget

		var notesWgtListener = (function(stateMap, configMap, thisMod){
			var statemap = stateMap;
			var configmap = configMap;
			var module = thisMod;
			var statusSetter = thisMod.widgetValidStatusSetter;

			var validate = function(wgt){
				var result = false;

				if(0 < wgt.value.length ){
					var value = wgt.value.trim();
					if(0 < value.length && value.length < configmap.constants.notesMaxLength){
						wgt.value = value;
						result = true;
					}

				}

				return result;
			};

			var listen = function(widget){
				if(!validate(widget))
					statusSetter(widget, false);
				else{
					statusSetter(widget, true);
					statemap.item.notes = widget.value.trim();
				}
				module.checkUiValidity();
			};

			return {
				listen: listen
			};


		})(this.stateMap, this.configMap, this);

		$( this.stateMap.jqueryMap.$notes ).on('change', 
			function(){notesWgtListener.listen(this);}
		);

		//---------------------------------submit widget

		var submitWgtListener = (function(stateMap, configMap){
			var statemap = stateMap;
			var configmap = configMap;
			
			var listen = function(widget){
				var data = {};
				data['item']=statemap.item;
				//we assume submit is only clicked when 
				//all the data is available to proceed
				configmap.modules['pubsub'].publish('item.save', data);

			};

			return {
				listen: listen
			};


		})(this.stateMap, this.configMap);

		$( this.stateMap.jqueryMap.$submit ).on('click', 
			function(){submitWgtListener.listen(this);}
		);

		//---------------------------------remove widget

		var removeWgtListener = (function(stateMap, configMap){
			var statemap = stateMap;
			var configmap = configMap;
			
			var listen = function(widget){
				var data = {};
				data['item']=statemap.item;
				//we assume submit is only clicked when 
				//all the data is available to proceed
				configmap.modules['pubsub'].publish('item.delete', data);

			};

			return {
				listen: listen
			};


		})(this.stateMap, this.configMap);

		$( this.stateMap.jqueryMap.$remove ).on('click', 
			function(){removeWgtListener.listen(this);}
		);
	};



	module.prototype.loadItem = function(o, uielement, uimode){

		this.configMap.uicontainer = uielement;
		this.stateMap.item = o;

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

		this.loadItemImages(o, col1) ;

		this.loadItemProperties(col2, uimode);



	};

	module.prototype.loadItemProperties = function(container, uimode){
		this.loadItemPropertiesUi(container);
		this.setJqueryMap();
		this.loadItemObject();
		this.setUiState(uimode);
		if(uimode == 'edit'){
			this.setEvents();
			this.checkUiValidity();
		}
	}

	module.prototype.setUiState = function(uimode){

		var validationWidgets = [ this.stateMap.jqueryMap.$name,
				this.stateMap.jqueryMap.$amount,
				this.stateMap.jqueryMap.$notes,
				this.stateMap.jqueryMap.$files ];
		var editableWidgets = [ this.stateMap.jqueryMap.$name,
				this.stateMap.jqueryMap.$amount,
				this.stateMap.jqueryMap.$notes,
				this.stateMap.jqueryMap.$files,
				this.stateMap.jqueryMap.$remove,
				this.stateMap.jqueryMap.$submit ];

		var actionWidgets = [ this.stateMap.jqueryMap.$files,
				this.stateMap.jqueryMap.$remove,
				this.stateMap.jqueryMap.$submit ];

		for(var i = 0 ; i < editableWidgets.length ; i++ ){

			var widget = editableWidgets[i];
			if('edit' == uimode)
				$( widget ).removeAttr('disabled');
			else 
				$( widget ).attr('disabled', 'disabled');
			
		}

		for(var i = 0 ; i < actionWidgets.length ; i++ ){

			var widget = actionWidgets[i];
			if('edit' == uimode)
				$( widget ).show();
			else 
				$( widget ).hide();
			
		}

		//submit will only be enabled after validation
		$( this.stateMap.jqueryMap.$submit ).attr('disabled', 'disabled');

		//if we are creating new item then ui starts as not valid
		if(!this.stateMap.item._id){
			//if we are creating new item then ui can't allow the removal
			$( this.stateMap.jqueryMap.$remove ).attr('disabled', 'disabled');
			//if we are creating new item then ui starts as not valid
			for(var i = 0 ; i < validationWidgets.length ; i++ )
				this.widgetValidStatusSetter(validationWidgets[i], false);
		}



	}

	module.prototype.loadItemObject = function(){
		this.stateMap.jqueryMap.$name.value = this.stateMap.item.name;
		this.stateMap.jqueryMap.$amount.value = this.stateMap.item.price;
		this.stateMap.jqueryMap.$notes.value = this.stateMap.item.notes;
		
	}


	module.prototype.loadItemPropertiesUi = function(container){

			var form = document.createElement("form");
			container.appendChild(form);
			form.classList.add("form-horizontal");
			var nameGroup = document.createElement("div");
			form.appendChild(nameGroup);
			nameGroup.classList.add("form-group");
			
				
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
			nameInput.setAttribute('maxlength', this.configMap.constants.nameMaxLength);

			var amountGroup = document.createElement("div");
			form.appendChild(amountGroup);
			amountGroup.classList.add("form-group");

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
			amountInput.setAttribute('max', this.configMap.constants.amountMax);

			var additionalDiv = document.createElement("div");
			amountGroup.appendChild(additionalDiv);
			additionalDiv.classList.add("col-sm-offset-6");

			var notesGroup = document.createElement("div");
			form.appendChild(notesGroup);
			notesGroup.classList.add("form-group");

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
			notesText.setAttribute('maxlength', this.configMap.constants.notesMaxLength);

			var filesGroup = document.createElement("div");
			form.appendChild(filesGroup);
			filesGroup.classList.add("form-group");

			var filesdiv = document.createElement("div");
			filesGroup.appendChild(filesdiv);
			filesdiv.classList.add("col-sm-offset-4");
			filesdiv.classList.add("col-sm-4");
			filesdiv.classList.add("col-sm-offset-4");

			var filesInput = document.createElement("input");
			filesdiv.appendChild(filesInput);
			filesInput.classList.add("form-control");
			filesInput.setAttribute('type', 'file');
			filesInput.setAttribute('id', 'inputFiles');
			filesInput.setAttribute('accept', 'image/*');
			filesInput.setAttribute('multiple', 'true');

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

	module.prototype.loadItemImages = function(o, uielement){

		var thumbWrapper = document.createElement("div");
		uielement.appendChild(thumbWrapper);
		thumbWrapper.classList.add("thumbnail");
		thumbWrapper.classList.add("thumbnail-fix-2");
		
		var slideshow = document.createElement("div");
		thumbWrapper.appendChild(slideshow);
		slideshow.classList.add("slideshow");

		
		for(var i = 0 ; i < o.images.length ; i++){
			var figure = document.createElement("figure");
			slideshow.appendChild(figure);
			if(i == 0)
				figure.classList.add("show");
			figure.setAttribute('id', o._id);
			var img = o.images[i]
			var imgWidget = document.createElement("img");
			figure.appendChild(imgWidget);
			imgWidget.classList.add("img-thumbnail");
			imgWidget.classList.add("img-thumbnail-fix");
			imgWidget.file = img.name;
			imgWidget.src = img.data;
			imgWidget.setAttribute('id', img.name);
		}

		var spanPrev = document.createElement("span");
		slideshow.appendChild(spanPrev);
		spanPrev.classList.add("prev");
		spanPrev.setAttribute('id', o._id);
		spanPrev.textContent = '<';

		var spanNext = document.createElement("span");
		slideshow.appendChild(spanNext);
		spanNext.classList.add("next");
		spanNext.setAttribute('id', o._id);
		spanNext.textContent = '>';

		var counter = 0;
		var figures = $( uielement ).find('figure');
		var numOfFigures = figures.length

		var showCurrent = function(){
			var itemToShow = Math.abs(counter%numOfFigures);
		 
			[].forEach.call( figures, function(el){
				el.classList.remove('show');
				}
			);
		 	console.log('going to show image ' + itemToShow);
			figures[itemToShow].classList.add("show");
		};
		
		var spanN = $( uielement ).find('.next','#' + o._id)[0];

		$( spanN ).on('click', function() {
			counter++;
			showCurrent();
			});
		
		var spanP = $( uielement ).find('.prev','#' + o._id)[0];

		$( spanP ).on('click',function() {
			counter--;
			showCurrent();
			});
	}




	return { module: module };

}());


/*

		module.prototype.ui2model = function(el){

		if(el.id == 'file'){

			var FileReaderCallBack = function(image,jqueryMap){
				var callbackFunc = function(data){
					image.data = 'data:image/jpeg;base64,' + data;
					var img = document.createElement("img");
					img.classList.add("img-responsive");
					img.classList.add("img-thumbnail");
					img.classList.add("col-sm-4");
					img.file = image.name;
					img.src = image.data;
					jqueryMap.$images.append(img);
					jqueryMap.$file[0].files[i]=img.file;
				};
				return { callback: callbackFunc};
			};

			//collect images
			var images=[];
			this.stateMap.jqueryMap.$images.empty();

			//so we try to find the new files
			for (var i=0; i < el.files.length;i++) {
				var selection = el.files[i];
				var newImage={};
				console.log('new file selection:' + selection.name);
				newImage.name=selection.name;
				newImage.type=selection.type;
				images.push(newImage);
				this.readFileAsBase64(el.files[i], FileReaderCallBack(newImage, this.stateMap.jqueryMap).callback);				
			}
			this.stateMap.item.images=images;
			//this.renderImages();

		}
		if(el.id == 'inputName'){
			this.stateMap.item.name = this.stateMap.jqueryMap.$name[0].value;
		}
		if(el.id == 'inputNotes'){
			this.stateMap.item.notes = this.stateMap.jqueryMap.$notes[0].value;
		}
		if(el.id == 'inputAmount'){
			this.stateMap.item.price = this.stateMap.jqueryMap.$price[0].value;
		}
	};

	module.prototype.model2ui = function(model){

		this.stateMap.item = model;
		$(this.stateMap.jqueryMap.$col[1]).empty();
		$(this.stateMap.jqueryMap.$col[0]).empty();
		this.createItemImageWidget(this.stateMap.jqueryMap.$col[0]);

	};

	

	module.prototype.createItemPropertiesWidget = function(item, container){

		var form = document.createElement("form");
		$( container ).append(form);
		form.classList.add("form-horizontal");
		var group1 = document.createElement("div");
		form.appendChild(group1);
		group1.classList.add("form-group");
		
			
		var nameLabel = document.createElement("label");
		group1.appendChild(nameLabel);
		nameLabel.setAttribute('for', 'inputName');
		nameLabel.classList.add("col-sm-2");
		nameLabel.classList.add("control-label");

		var nameWgt = document.createElement("div");
		group1.appendChild(nameWgt);
		nameWgt.classList.add("col-sm-10");
		var nameInput = document.createElement("div");
		group1.appendChild(nameWgt);
		nameWgt.classList.add("col-sm-10");

		outWrapper.appendChild(thumbWrapper);
		thumbWrapper.classList.add("thumbnail");
		thumbWrapper.classList.add("thumbnail-fix-2");
		
	};


	module.prototype.setJqueryMap = function($container){
		if(null != $container){
			this.stateMap.jqueryMap = {
				$container : $container,
				$col : $container.children('#col')
				,
				$price : $container.find('#inputAmount'),
				$file : $container.find('#file'),
				$name : $container.find('#inputName'),
				$notes : $container.find('#inputNotes'),
				$submit : $container.find('#submit'),
				$remove : $container.find('#remove')
			};
		}
		else {
			this.stateMap.jqueryMap = {};
		}
	};






	module.prototype.setEvents = function(){

		var widgets = [
			this.stateMap.jqueryMap.$price,
			this.stateMap.jqueryMap.$name,
			this.stateMap.jqueryMap.$notes,
			this.stateMap.jqueryMap.$file
		];

		for(var i = 0 ; i < widgets.length ; i++){
			widgets[i].on('change',function(){
				pubsub.publish('uiItemChange', this);
			});

		}

		this.stateMap.jqueryMap.$submit.on('click',function(){
			pubsub.publish('submitItem', this);
		});

		this.stateMap.jqueryMap.$remove.on('click',function(){
			pubsub.publish('delItem', this);
		});

	};

	module.prototype.readFileAsBase64 = function(file, callback){
		var reader = new FileReader();
		reader.onload = function(event){
			var data = event.target.result.replace("data:"+ file.type +";base64,", '');
			callback(data);
		};
		reader.readAsDataURL(file);
	};

	module.prototype.ui2model = function(el){

		if(el.id == 'file'){

			var FileReaderCallBack = function(image,jqueryMap){
				var callbackFunc = function(data){
					image.data = 'data:image/jpeg;base64,' + data;
					var img = document.createElement("img");
					img.classList.add("img-responsive");
					img.classList.add("img-thumbnail");
					img.classList.add("col-sm-4");
					img.file = image.name;
					img.src = image.data;
					jqueryMap.$images.append(img);
					jqueryMap.$file[0].files[i]=img.file;
				};
				return { callback: callbackFunc};
			};

			//collect images
			var images=[];
			this.stateMap.jqueryMap.$images.empty();

			//so we try to find the new files
			for (var i=0; i < el.files.length;i++) {
				var selection = el.files[i];
				var newImage={};
				console.log('new file selection:' + selection.name);
				newImage.name=selection.name;
				newImage.type=selection.type;
				images.push(newImage);
				this.readFileAsBase64(el.files[i], FileReaderCallBack(newImage, this.stateMap.jqueryMap).callback);				
			}
			this.stateMap.item.images=images;
			//this.renderImages();

		}
		if(el.id == 'inputName'){
			this.stateMap.item.name = this.stateMap.jqueryMap.$name[0].value;
		}
		if(el.id == 'inputNotes'){
			this.stateMap.item.notes = this.stateMap.jqueryMap.$notes[0].value;
		}
		if(el.id == 'inputAmount'){
			this.stateMap.item.price = this.stateMap.jqueryMap.$price[0].value;
		}
	};

	module.prototype.renderImages = function(){

		this.stateMap.jqueryMap.$file[0].files = [];
		this.stateMap.jqueryMap.$file[0].value=null;
		this.stateMap.jqueryMap.$images.empty();
		for (var i=0; i < this.stateMap.item.images.length;i++) {
			var image = this.stateMap.item.images[i];
			var img = document.createElement("img");
			img.classList.add("img-responsive");
			img.classList.add("img-thumbnail");
			img.classList.add("col-sm-4");
			img.file = image.name;
			img.src = image.data;
			this.stateMap.jqueryMap.$images.append(img);
			this.stateMap.jqueryMap.$file[0].files[i]=img.file;
		}

	};

	module.prototype.model2ui = function(model){

		this.stateMap.item = model;
		$(this.stateMap.jqueryMap.$col[1]).empty();
		$(this.stateMap.jqueryMap.$col[0]).empty();
		this.configMap.modules['widgets'].createItemImageWidget(this.stateMap.item, this.stateMap.jqueryMap.$col[0]);
		//this.renderImages();

	};

	module.prototype.uiValidation = function(){
		
		var valid = true;

		var widgets = [
			this.stateMap.jqueryMap.$price[0],
			this.stateMap.jqueryMap.$file[0],
			this.stateMap.jqueryMap.$name[0],
			this.stateMap.jqueryMap.$notes[0]
		];

		for(var i = 0 ; i < widgets.length ; i++)
			valid &= this.widgetValidation(widgets[i]);

		pubsub.publish('uiValid', valid);

		return valid;
	};

	module.prototype.widgetValidation = function(item){
		
		var valid = false;

		if( item === this.stateMap.jqueryMap.$file[0] )
			valid = (0 < item.value.length) || (0 < this.stateMap.item.images.length);	
		else
			if(item.value)
				valid = true;

		var formGroup=this.stateMap.jqueryMap.$container.find(item).parents('.form-group');

		if(!valid) {
			if(!formGroup.hasClass("has-error"))
				formGroup.addClass("has-error");
		}
		else {
			if(formGroup.hasClass("has-error"))
				formGroup.removeClass("has-error");
		}
		
		return valid;
	};

	module.prototype.modelValidation = function(item){
		console.log('@modelValidation');
		var valid = true;

		if(!this.stateMap.item.name)
			return false;
		if(!this.stateMap.item.notes)
			return false;
		if(!this.stateMap.item.price)
			return false;
		if(1 > this.stateMap.item.images.length)
			return false;

		console.log('modelValidation@[' + valid + ']');
		return valid;
	};


	

	module.prototype.onEvent = function(event, data){

		if(event == "onBody") { 
			
			if( null != this.stateMap.jqueryMap.$col ) 
					$( this.stateMap.jqueryMap.$col ).empty();

			if ( null != data.body && "item" != data.body ) {
				this.setActive(false);
				return;
			}

			this.setActive(true);

			if(null != data.config && null != data.config.id){

				//pubsub.publish('uiEditMode', true);
				var callback = (function(module){
					var mod = module;

					var ok= function(o){
						mod.model2ui(o);
					};
					var nok= function(o){
						alert('not ok');
					};
					return {
						ok: ok,
						nok: nok
					};
				}(this));

				this.configMap.modules['api'].getItem(data.config.id, callback);
			}
			else {
				//pubsub.publish('uiValid', false);
				//pubsub.publish('uiEditMode', false);
				var newItem = {
					_id: null,
					images:[],
					name: null,
					notes: null,
					price: null
				};
				this.model2ui(newItem);
			}
		}
		
		else if(event == 'submitItem'){
			var valid = this.modelValidation();
			console.log('form is valid?' + valid);
			if(valid){
				var callback = {
					ok: function(o){
						window.location.hash = '#body=browse';
					},
					nok: function(o){
						alert('not ok');
					}
				};
				this.configMap.modules['api'].setItem(this.stateMap.item,callback);
			}
		}
		else if (event == 'delItem') {
			var callback = {
				ok: function(o){
					window.location.hash = '#body=browse';
				},
				nok: function(o){
					alert('not ok');
				}
			};
			this.configMap.modules['api'].delItem(this.stateMap.item._id,callback);
		}
		else if (event == 'uiItemChange') {
			this.uiValidation(data);
			this.ui2model(data);
		}
		else if (event == 'modelItemChange') {
			this.model2ui(data);
		}
		else if (event == 'uiValid') {
			if(data)
				this.stateMap.jqueryMap.$submit.removeAttr('disabled');
			else
				this.stateMap.jqueryMap.$submit.attr('disabled', 'disabled');
		}
		else if (event == 'uiEditMode') {
			if(data)
				this.stateMap.jqueryMap.$remove.removeAttr('disabled');
			else
				this.stateMap.jqueryMap.$remove.attr('disabled', 'disabled');
		}
		else {
				if(this.isActive()){
					this.stateMap.jqueryMap.$container.empty();
					this.setJqueryMap(null);
					this.setActive(false);
				}
		}
		
	};	



*/