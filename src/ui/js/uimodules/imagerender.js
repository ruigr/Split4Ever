
var ImageRender = (function() {

	var module = function(name){
		common.Mod.call(this,name);
		this.configMap.events = []; 
		this.configMap.requires = ['utils'];
		this.configMap.uiConfig = null;
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;


	module.prototype.render = function(imagesArray, $container){

		for(var i = 0 ; i < imagesArray.length ; i++){
			var figure = document.createElement("figure");
			$( $container ).append(figure);
			if(i == 0)
				figure.classList.add("show");

			var img = imagesArray[i]
			var imgWidget = document.createElement("img");
			figure.appendChild(imgWidget);
			imgWidget.classList.add("img-thumbnail");
			imgWidget.classList.add("img-thumbnail-fix");
			imgWidget.file = img.name;
			imgWidget.src = img.data;
			//imgWidget.setAttribute('id', img.name);
		}

		var spanPrev = document.createElement("span");
		$( $container ).append(spanPrev);
		spanPrev.classList.add("prev");
		//spanPrev.setAttribute('id', id);
		spanPrev.textContent = '<';

		var spanNext = document.createElement("span");
		$( $container ).append(spanNext);
		spanNext.classList.add("next");
		//spanNext.setAttribute('id', id);
		spanNext.textContent = '>';

		var counter = 0;
		var figures = $( $container ).find('figure');
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
		
		var spanN = $( $container ).find('.next')[0];
		//var spanN = $( $container ).find('.next','#' + id)[0];
		$( spanN ).on('click', function() {
			counter++;
			showCurrent();
			});
		
		var spanP = $( $container ).find('.prev')[0];
		//var spanP = $( $container ).find('.prev','#' + id)[0];
		$( spanP ).on('click',function() {
			counter--;
			showCurrent();
			});

	}

	return { module: module};

}());
