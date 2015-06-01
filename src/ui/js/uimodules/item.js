var Item = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.active = false;
		this.configMap = {
			events: ['onBody', 'submitItem', 'uiItemChange', 'modelItemChange', 'modelItemImagesChange'],
			main_html : '<form class="form-horizontal"> ' +
				  '<div class="form-group"> ' +
				    '<label for="inputName" class="col-sm-2 control-label">name</label> ' +
				    '<div class="col-sm-10"> ' +
				      '<input type="text" class="form-control" id="inputName" placeholder="part name"> ' +
				    '</div> ' +
				  '</div> ' +
				  '<div class="form-group"> ' +
				    '<label class="col-sm-2 control-label" for="inputAmount">&euro;</label> ' +
				    '<div class="col-sm-4"> ' +
				    	'<input type="text" class="form-control" id="inputAmount" placeholder="amount"> ' +
				    '</div> ' +
				    '<div class="col-sm-offset-6"></div> ' +
				  '</div> ' +
				'<div class="form-group"> ' +
	    			'<label for="inputNotes" class="col-sm-2 control-label">notes</label> ' +
	    			'<div class="col-sm-10"> ' +
			      		'<textarea class="form-control" id="inputNotes" placeholder="...part notes..." rows="4"></textarea> ' +
			    	'</div> ' +
		  		'</div> ' +
				'<div class="form-group"> ' +
					'<div class="image-window" id="images"> ' +
						//'<img src="deprecated/img/1.jpg" class="img-responsive img-thumbnail col-sm-4"/> ' +
					'</div> ' +
				'</div> ' +
				'<div class="form-group"> ' +
					'<div class="col-sm-offset-4 col-sm-4 col-sm-offset-4"> ' +
		    			'<input type="file" id="file" accept="image/*" class="form-control" multiple="true"/> ' +
				    '</div> ' +
				'</div> ' +
				'<div class="form-group"> ' +
				    '<div class="col-sm-offset-10 col-sm-2"> ' +
				      '<button type="submit" class="btn btn-default pull-right" id="submit">Submit</button> ' +
				    '</div> ' +
				'</div> ' +
				'</form>',
				requires: ['api'],
				api : null
		}; 
		this.stateMap = {
			anchor_map : {},
			jqueryMap : {},
			item: {
				id: null,
				images:[],
				name: '',
				notes: '',
				price: ''
			}	
		}; 
		
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.setJqueryMap = function($container){
		if(null != $container){
			this.stateMap.jqueryMap = {
				$container : $container,
				$images : $container.find('#images'),
				$price : $container.find('#inputAmount'),
				$file : $container.find('#file'),
				$name : $container.find('#inputName'),
				$notes : $container.find('#inputNotes'),
				$submit : $container.find('#submit')
			};
		}
		else {
			this.stateMap.jqueryMap = {};
		}
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

			var FileReaderCallBack = function(image, model){
				var image = image;
				var callbackFunc = function(data){
					image.data = 'data:image/jpeg;base64,' + data;
					pubsub.publish( 'modelItemImagesChange', model);
				};
				return { callback: callbackFunc};
			};


			var images=[];

			//so we try to find the new files
			for (var i=0; i < el.files.length;i++) {
				var selection = el.files[i];
				var newImage={};
				console.log('new file selection:' + selection.name);
				newImage.name=selection.name;
				newImage.type=selection.type;
				images.push(newImage);
				this.readFileAsBase64(el.files[i], FileReaderCallBack(newImage, this.stateMap.item).callback);				
			}
			this.stateMap.item.images=images;
			if(images.length == 0){
				pubsub.publish( 'modelItemImagesChange', this.stateMap.item);
			}

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

		this.stateMap.jqueryMap.$price.value = model.price;
		this.stateMap.jqueryMap.$name.value = model.name;
		this.stateMap.jqueryMap.$notes.value = model.notes;
		this.stateMap.jqueryMap.$file.value = model.file;

	};

	module.prototype.validation = function(item){
		var valid = true;
		var widgets = [
			this.stateMap.jqueryMap.$price[0],
			this.stateMap.jqueryMap.$file[0],
			this.stateMap.jqueryMap.$name[0],
			this.stateMap.jqueryMap.$notes[0]
		];
		
		for(var i = 0 ; i < widgets.length ; i++)
			valid &= this.widgetValidation(widgets[i]);
		
		return valid;
	};

	module.prototype.widgetValidation = function(item){
		var valid = false;

		if(!item.value)
			console.log('item empty');
		else
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

	module.prototype.modelImages2ui = function(model){

		this.stateMap.jqueryMap.$images.empty();
		for (var i=0; i < model.images.length;i++) {
			var image = model.images[i];
			var img = document.createElement("img");
			img.classList.add("img-responsive");
			img.classList.add("img-thumbnail");
			img.classList.add("col-sm-4");
			img.file = image.name;
			img.src = image.data;
			this.stateMap.jqueryMap.$images.append(img);
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

	};


	module.prototype.onEvent = function(event, data){

		if(event == 'submitItem'){
			var valid = this.validation();
			console.log('form is valid?' + valid);

			if(valid){

				var callback = {
					ok: function(){
						window.location.hash = '#body=browse';
					},
					nok: function(){
						alert('not ok');
					}
				};
				this.configMap.api.setItem(this.stateMap.item,callback);
			}
		}
		else if (event == 'uiItemChange') {
			this.widgetValidation(data);
			this.ui2model(data);
		}
		else if (event == 'modelItemChange') {
			this.model2ui(data);
		}
		else if (event == 'modelItemImagesChange') {
			this.modelImages2ui(data);
		}
		else if(event == "onBody" && null != data.body && data.body == "item"){
			if(!this.isActive()){
				this.setActive(true);
				this.configMap.container.html(this.configMap.main_html);
				this.setJqueryMap(this.configMap.container);
		
				/*
				if(null != data.config){
					pubsub.publish( 'retrieveData', this.loadData);	
				}
				pubsub.publish( 'retrieveData', this.loadData);
				*/
				this.setEvents();
			}
			else {
				var newItem = {
					id: null,
					images:[],
					name: null,
					notes: null,
					price: null
				};
				this.model2ui(newItem);
			}
		}
		else {
				if(this.isActive()){
					this.stateMap.jqueryMap.$container.remove();
					this.setJqueryMap(null);
					this.setActive(false);
				}
		}
	};	

	module.prototype.initModule = function($container){
		if(null != this.configMap.events)
			pubsub.subscribe(this.configMap.events, this);
		
		this.configMap.container = $container;
		$container.html(this.configMap.main_html);
		this.setJqueryMap($container);
		this.setEvents();
	};

	return { module: module };

}());