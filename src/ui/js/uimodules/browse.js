var Browse = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.active = false;
		this.configMap = {
			events: ['onBody'],
			requires: ['api'],
			api : null,
			main_html : "<div class='browse row'></div>"
		}; 
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;
	/*
		item: {
				id: null,
				images:[],
				name: '',
				notes: '',
				price: ''
			}
	*/
	

	module.prototype.createImageWidget = function(item){

		var widget = document.createElement("div");
		widget.classList.add("col-sm-6");
		widget.classList.add("col-md-3");

		var widget2 = document.createElement("div");
		widget2.classList.add("thumbnail");
		widget2.classList.add("thumbnail-browse-fix");

		var anchorWidget = document.createElement("a");
		anchorWidget.setAttribute("href",window.location.origin + '/#body=item:id,' + item.id );
	
		
		var imgWidget = document.createElement("img");
		imgWidget.classList.add("img-thumbnail");
		var img = item.images[0];
		imgWidget.file = img.name;
		imgWidget.src = img.data;
		
		var captionWidget = document.createElement("div");
		captionWidget.classList.add("caption");
		captionWidget.classList.add("caption-browse-fix");
		
		var nameWidget = document.createElement("h4");
		nameWidget.classList.add("thumbnail-label");
		nameWidget.textContent = item.name;

		var spanWidget = document.createElement("span");
		spanWidget.classList.add("label-default");
		spanWidget.classList.add("pull-right");
		spanWidget.textContent = "€ " + item.price;

		var notesWidget = document.createElement("p");
		notesWidget.textContent = item.notes;


		captionWidget.appendChild(nameWidget);
		captionWidget.appendChild(spanWidget);
		captionWidget.appendChild(notesWidget);
		

		widget.appendChild(widget2);
		anchorWidget.appendChild(imgWidget);
		widget2.appendChild(anchorWidget);
		widget2.appendChild(captionWidget);

		return widget;

	};

	module.prototype.loadData = function(items){

		this.stateMap.jqueryMap.$browser.empty();
		for (var i=0; i < items.length;i++) {
			var item = items[i];
			this.stateMap.jqueryMap.$browser.append(this.createImageWidget(item));
		}	

	};

	module.prototype.onEvent = function(event, data){

		if(event == "onBody" && null != data.body && data.body == "browse"){

			if(!this.isActive()){

				this.setActive(true);
				this.configMap.container.html(this.configMap.main_html);
				this.setJqueryMap(this.configMap.container);

				var cb = (function(module) {
					var mod = module;
					var ok = function(o){
						console.log('ok...loading items');
						if(Array.isArray(o)){
							console.log('ok...loading items....really');
							mod.loadData(o);
						}
					};

					var nok = function(o){
						console.log('not ok');
					};

					return {
						ok: ok,
						nok: nok
					};
				}(this));

				this.configMap.api.getItems(null,cb);
	/*			pubsub.publish( 'retrieveData', this.loadData);
				this.setEvents();*/
			}
		}
		else {
				if(this.isActive()){
					this.setActive(false);
					this.stateMap.jqueryMap.$browser.empty();
					//this.setJqueryMap(null);
				}
		}

	};



	module.prototype.setJqueryMap = function($container){
		if(null != $container){
			this.stateMap.jqueryMap = {
				$container : this.configMap.container,
				$browser: $container.find('.browse'),
				$msg : $container.find('.msg')
			};
		}
		else {
			this.stateMap.jqueryMap = {};
		}
	};

	module.prototype.initModule = function($container){
		pubsub.subscribe(this.configMap.events, this);
		this.configMap.container = $container;
	};

	return { module: module };

}());