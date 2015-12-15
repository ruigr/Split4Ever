var Browser = (function(){

	var module = function(name){
		base.UIMod.call(this,name);
		this.configMap.events = ['onBody'];
		this.configMap.requires = ['api', 'utils', 'pubsub'];
	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;


	module.prototype.onEvent = function(event, context){
		this.configMap.modules['utils'].logger.enter(this.name, 'onEvent[' + event + ']');

		if(event == "onBody" && null != context.body && context.body == "browser"){

			this.configMap.uicontainer = context.container;
			this.configMap.uicontainer.empty();

			var callback = (function(uimodule, uielement) {
				var ok = function(o){
					console.log('ok...loading items');
						uimodule.loadItems(o, uielement);
				};
				var nok = function(o){
					console.log('not ok');
				};
				return {
					ok: ok,
					nok: nok
				};
			}(this, this.configMap.uicontainer));

			this.configMap.modules['api'].getItems(callback);

		}
		
		this.configMap.modules['utils'].logger.leave(this.name, 'onEvent');
	};

	module.prototype.loadItems = function(items, container){
		var outdiv = this.configMap.modules['utils'].createElement('div', ["browse", "row"]);
		$( container ).append(outdiv);

		for(var i = 0; i < items.length ; i++){
			this.createItemWidget(items[i], outdiv);
		}
	};

	module.prototype.createItemWidget = function(item, container){
		var logger = this.configMap.modules['utils'].logger;
		logger.enter(this.name, 'createItemWidget');

		var outWrapper = this.configMap.modules['utils'].createElement('div', ["container"], [ { name: 'id', value: 'header' } ]);
		
		var outWrapper = this.configMap.modules['utils'].createElement('div', ["col-sm-6", "col-md-4"]);
		$( container ).append(outWrapper);	
		var thumbWrapper = this.configMap.modules['utils'].createElement('div', ["thumbnail", "thumbnail-browse-fix"]);
		outWrapper.appendChild(thumbWrapper);
		var slideshow = this.configMap.modules['utils'].createElement('div', ["slideshow"]);
		thumbWrapper.appendChild(slideshow);
		var figcaption = this.configMap.modules['utils'].createElement('figcaption');
		//---
		slideshow.appendChild(figcaption);
		var row1 = this.configMap.modules['utils'].createElement('div', ["row", "row-fix"]);
		figcaption.appendChild(row1);
		var row2 = this.configMap.modules['utils'].createElement('div', ["row", "row-fix"]);
		figcaption.appendChild(row2);
		var titleDiv = this.configMap.modules['utils'].createElement('div', ["pull-left"]);
		row1.appendChild(titleDiv);
		var anchorWidget = this.configMap.modules['utils'].createElement('a',null, [{ name: 'href', value: window.location.origin + '/#body=item:id,' + item._id }]);
		titleDiv.appendChild(anchorWidget);
		var h4 = document.createElement("h4");
		anchorWidget.appendChild(h4);
		h4.textContent = item.name;
		var priceDiv = this.configMap.modules['utils'].createElement('div', ["pull-right"]);
		row1.appendChild(priceDiv);
		var h5 = document.createElement("h5");
		priceDiv.appendChild(h5);
		h5.innerText = '€ ' + item.price;
		var notesDiv = this.configMap.modules['utils'].createElement('div', ["pull-left"]);
		row2.appendChild(notesDiv);
		var p = document.createElement("p");
		notesDiv.appendChild(p);
		
		if(200 <= item.notes.length){
			p.textContent = item.notes.substr(0,197) + '...';
		}
		else
			p.textContent = item.notes;

		if( Array.isArray(item.images)){

			for(var i = 0 ; i < item.images.length ; i++){
				var figure = this.configMap.modules['utils'].createElement('figure', null, [ { name: 'id', value: item._id } ]);
				slideshow.appendChild(figure);
				if(i == 0)
					figure.classList.add("show");

				var img = item.images[i]
				var imgWidget = this.configMap.modules['utils'].createElement('img', ["img-thumbnail", "img-thumbnail-fix"], [ { name: 'id', value: img.name } ]);
				figure.appendChild(imgWidget);
				imgWidget.file = img.name;
				imgWidget.src = img.data;

			}
			var spanPrev = this.configMap.modules['utils'].createElement('span', ["prev"], [ { name: 'id', value: item._id } ]);
			slideshow.appendChild(spanPrev);
			spanPrev.textContent = '<';

			var spanNext = this.configMap.modules['utils'].createElement('span', ["next"], [ { name: 'id', value: item._id } ]);
			slideshow.appendChild(spanNext);
			spanNext.textContent = '>';

			var counter = 0;
			var figures = $( slideshow ).find('figure');
			var numOfFigures = figures.length

			var showCurrent = function(){
				var itemToShow = Math.abs(counter%numOfFigures);
			 
				[].forEach.call( figures, function(el){
					el.classList.remove('show');
					}
				);
			 	logger.log(this.name, 'going to show image ' + itemToShow);
				figures[itemToShow].classList.add('show');
			};
			

			var spanN = $( slideshow ).find('.next','#' + item._id)[0];

			$( spanN ).on('click', function() {
				counter++;
				showCurrent();
				});
			
			var spanP = $( slideshow ).find('.prev','#' + item._id)[0];

			$( spanP ).on('click',function() {
				counter--;
				showCurrent();
				});

		}

		logger.leave(this.name, 'createItemWidget');
	};

	return { module: module };

}());