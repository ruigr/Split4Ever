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
					if(totalNumOfObj == statemap.item.images.length){
						//last image being loaded so load ui and check validity to enable submit eventually
						module.loadItemImages(statemap.item, statemap.jqueryMap.$col1[0]) ;
						module.checkUiValidity();
					}

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
				if(doCheck){ //we have new images lets check
					if(!validate(widget))
						statusSetter(widget, false);
					else{
						//we are valid so lets disable submit while we load images
						$( statemap.jqueryMap.$submit ).attr('disabled', 'disabled');
						statusSetter(widget, true);
						updateModelImages(widget);
					}	
				}
				
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
