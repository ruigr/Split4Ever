var Header = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.configMap.events = ['onBody'];
		this.configMap.main_html = '<div class="row">' +
					'<div class="col-sm-2" id="headerdiv1">' + 
					'</div>' +
					'<div class="col-sm-3" id="headerdiv15">' + 
					'</div>' +
					'<div class="col-sm-3" id="headerdiv16">' + 
					'</div>' +
					'<div class="col-sm-3" id="headerdiv2">' +
					'</div>' +
					'<div class="col-sm-1" id="headerdiv3">' +
					'</div>' +
				'</div>' ;
		this.configMap.requires = ['utils', 'pubsub'];
		this.stateMap.anchor_map = {};
		this.stateMap.jqueryMap = {}; 
		this.stateMap.gui = null;
		
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.setJqueryMap = function(){

		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer,
			$hd1 : this.configMap.uicontainer.find('#headerdiv1'),
			$hd15 : this.configMap.uicontainer.find('#headerdiv15'),
			$hd16 : this.configMap.uicontainer.find('#headerdiv16'),
			$hd2: this.configMap.uicontainer.find('#headerdiv2'),
			$hd3: this.configMap.uicontainer.find('#headerdiv3')
		};

	};

	module.prototype.setGuiState = function(state) {

		if(1 > this.stateMap.jqueryMap.$hd1.children().length){
			//always load image in the beginning
			var anchorWidget = document.createElement("a");
			anchorWidget.setAttribute("href",window.location.origin + '/#body=browse' );
			//'<img src="img/header.png" class="img-rounded"/>' + 
			var imgWidget = document.createElement("img");
			imgWidget.setAttribute("src","img/header.png");
			imgWidget.classList.add("img-rounded");
			anchorWidget.appendChild(imgWidget);
			this.stateMap.jqueryMap.$hd1.append(anchorWidget);

			var phoneWidget = document.createElement("h2");
			phoneWidget.innerText = '+351 91 91 594 54';
			var titleWidget = document.createElement("h4");
			titleWidget.innerText = 'Pecas classicas VW';
			var subTitleWidget1 = document.createElement("div");
			subTitleWidget1.innerText ='Compra e venda de material para vw antigo';
			var subTitleWidget2 = document.createElement("div");
			subTitleWidget2.innerText ='Material novo(new old stock), usado e recondicionado';
			var lineBreak = document.createElement("br");

			this.stateMap.jqueryMap.$hd15.append(phoneWidget);
			this.stateMap.jqueryMap.$hd15.append(titleWidget);

			this.stateMap.jqueryMap.$hd16.append(subTitleWidget1);
			this.stateMap.jqueryMap.$hd16.append(lineBreak);
			this.stateMap.jqueryMap.$hd16.append(subTitleWidget2);


		}

		if(state == this.stateMap.gui){
			//do nothing
		}
		else if( state == 'item' ) {
			this.stateMap.jqueryMap.$hd2.empty();
			this.stateMap.jqueryMap.$hd3.empty();
			this.stateMap.gui = state;

		}
		else { //browse
			//<input type="text" class="form-control" id="search" placeholder="..."/>'
			// <button type="submit" class="btn btn-default">search</button>'
			this.stateMap.jqueryMap.$hd2.empty();
			this.stateMap.jqueryMap.$hd3.empty();
			this.stateMap.gui = state;

			var searchTextWidget = document.createElement("input");
			searchTextWidget.setAttribute("type","text");
			searchTextWidget.setAttribute("id","search");
			searchTextWidget.setAttribute("placeholder","...");
			searchTextWidget.classList.add("form-control");
			searchTextWidget.classList.add("pull-right");
			this.stateMap.jqueryMap.$hd2.append(searchTextWidget);

			var btnWidget = document.createElement("button");
			btnWidget.setAttribute("type","submit");
			btnWidget.classList.add("btn");
			btnWidget.classList.add("btn-default");
			btnWidget.classList.add("pull-right");
			btnWidget.textContent = "search";
			this.stateMap.jqueryMap.$hd3.append(btnWidget);
		}
		
	} ;

	module.prototype.onEvent = function(event, data){

		if(event == "onBody"){
			this.setGuiState(data.body)
		}
		

	};




	module.prototype.setEvents = function(){
/*		this.stateMap.jqueryMap.$msg.click(function(){
			alert("msg")
		});*/
	};

	return { module: module };

}());