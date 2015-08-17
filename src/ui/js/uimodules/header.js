var Header = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.configMap.events = ['onBody'];
		this.configMap.requires = ['utils', 'pubsub'];
		this.stateMap.anchor_map = {};
		this.stateMap.jqueryMap = {}; 
/*		this.stateMap.gui = null;*/
		
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.setJqueryMap = function(){

		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer,
			$search : $( this.configMap.uicontainer ).find('#search')
		};

	};

	module.prototype.initUi = function(){

		var div1 = document.createElement("div");
		$( this.configMap.uicontainer ).append(div1);
		div1.classList.add("navbar-header");

		var button1 = document.createElement("button");
		div1.appendChild(button1);
		button1.classList.add("navbar-toggle");
		button1.classList.add("collapsed");
		button1.setAttribute('type', 'button');
		button1.setAttribute('data-toggle', 'collapse');
		button1.setAttribute('data-target', '#navbar');
		button1.setAttribute('aria-expanded', 'false');
		button1.setAttribute('aria-control', 'navbar');

		var span1 = document.createElement("span");
		button1.appendChild(span1);
		span1.classList.add("sr-only");
		span1.innerText='Toggle navigation';
		var span2 = document.createElement("span");
		button1.appendChild(span2);
		span2.classList.add("icon-bar");
		var span3 = document.createElement("span");
		button1.appendChild(span3);
		span3.classList.add("icon-bar");
		var span4 = document.createElement("span");
		button1.appendChild(span4);
		span4.classList.add("icon-bar");

		var a1 = document.createElement("a");
		div1.appendChild(a1);
		a1.classList.add("navbar-brand");
		a1.classList.add("navbar-brand-o");
		a1.setAttribute("href",window.location.origin + '/#body=browse' );

		var img1 = document.createElement("img");
		a1.appendChild(img1);
		img1.classList.add("img-rounded");
		img1.setAttribute('src', 'img/header.png');

		var a2 = document.createElement("a");
		div1.appendChild(a2);
		a2.classList.add("navbar-brand");
		a2.classList.add("navbar-brand-o");
		a2.setAttribute("href",window.location.origin + '/#body=browse' );
		a2.innerHTML='VWPARTS<small><em> pecas classicas VW</em></small><br>+351 91 91 594 54';

		var div2 = document.createElement("div");
		$( this.configMap.uicontainer ).append(div2);
		div2.classList.add("navbar-collapse");
		div2.classList.add("collapse");
		div2.setAttribute("id","navbar" );

		var ul = document.createElement("ul");
		div2.appendChild(ul);
		ul.classList.add("nav");
		ul.classList.add("navbar-nav");
		ul.classList.add("navbar-right");

		var li1 = document.createElement("li");
		ul.appendChild(li1);
		var a3 = document.createElement("a");
		li1.appendChild(a3);
		a3.innerHTML='about';
		a3.setAttribute("href",window.location.origin + '/#body=about' );

		var li2 = document.createElement("li");
		ul.appendChild(li2);
		var a4 = document.createElement("a");
		li2.appendChild(a4);
		a4.innerHTML='contacts';
		a4.setAttribute("href",window.location.origin + '/#body=contacts' );

		var form = document.createElement("form");
		div2.appendChild(form);
		form.classList.add("navbar-form");
		form.classList.add("navbar-right");

		var input = document.createElement("input");
		form.appendChild(input);
		input.classList.add("form-control");
		input.setAttribute("type","text" );
		input.setAttribute("placeholder","search..." );
		input.setAttribute("id","search" );
	};

	module.prototype.setGuiState = function(state) {
		if( state == 'item' )
			$( this.stateMap.jqueryMap.$search ).hide();
		else
			$( this.stateMap.jqueryMap.$search ).show();
	} ;

	module.prototype.onEvent = function(event, data){

		if(event == "onBody")
			this.setGuiState(data.body)

	};

	module.prototype.setEvents = function(){
/*		this.stateMap.jqueryMap.$msg.click(function(){
			alert("msg")
		});*/
	};

	return { module: module };

}());