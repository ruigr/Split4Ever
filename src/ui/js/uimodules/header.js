var Header = (function(){

	var module = function(name){
		base.UIMod.call(this,name);
		this.configMap.events = ['onBody', 'onContainerDefinition'];
		this.configMap.requires = ['utils', 'pubsub'];
		this.stateMap.anchor_map = {};
		this.stateMap.jqueryMap = {}; 
	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.setJqueryMap = function(){
		this.stateMap.jqueryMap = {
			$search : $( this.configMap.uicontainer ).find('#search')
		};

	};

	module.prototype.initUI = function(){

		this.configMap.modules['utils'].logger.enter(this.name, 'initUi');
		var div1 = this.configMap.modules['utils'].createElement('div', ["navbar-header"]);
		$( this.configMap.uicontainer ).append(div1);

		var button1 = this.configMap.modules['utils'].createElement('button', 
			["navbar-toggle", "collapsed"], 
			[ { name: 'type', value: 'button'}, { name: 'data-toggle', value: 'collapse'},
				{ name: 'data-target', value: '#navbar'}, { name: 'aria-expanded', value: 'false'},
				{ name: 'aria-control', value: 'navbar'} ]);
		div1.appendChild(button1);

		var span1 = this.configMap.modules['utils'].createElement('span', ["sr-only"]);
		button1.appendChild(span1);
		span1.innerText='Toggle navigation';
		var span2 = this.configMap.modules['utils'].createElement('span', ["icon-bar"]);
		button1.appendChild(span2);
		var span3 = this.configMap.modules['utils'].createElement('span', ["icon-bar"]);
		button1.appendChild(span3);
		var span4 = this.configMap.modules['utils'].createElement('span', ["icon-bar"]);
		button1.appendChild(span4);

		var a1 = this.configMap.modules['utils'].createElement('a', 
			["navbar-brand","navbar-brand-o"], [{ name: 'href', value: window.location.origin + '/#body=browse'} ]);
		div1.appendChild(a1);

		var img1 = this.configMap.modules['utils'].createElement('img', ["img-rounded"], [ { name: 'src', value: 'img/header.png'} ]);
		a1.appendChild(img1);

		var a2 = this.configMap.modules['utils'].createElement('a', 
			["navbar-brand","navbar-brand-o"], [{ name: 'href', value: window.location.origin + '/#body=browse'} ]);
		div1.appendChild(a2);
		a2.innerHTML='VWPARTS<small><em> pecas classicas VW</em></small><br>+351 91 91 594 54';

		var div2 = this.configMap.modules['utils'].createElement('div', 
			["navbar-collapse","collapse"], [{ name: 'id', value: "navbar"} ]);
		$( this.configMap.uicontainer ).append(div2);

		var ul = this.configMap.modules['utils'].createElement('ul', 
			["nav","navbar-nav", "navbar-right"] );
		div2.appendChild(ul);

		var li1 = this.configMap.modules['utils'].createElement('li');
		ul.appendChild(li1);
		var a3 = this.configMap.modules['utils'].createElement("a", null, [ { name: 'href', value: window.location.origin + '/#body=about'} ]);
		li1.appendChild(a3);
		a3.innerHTML='about';

		var li2 = document.createElement("li");
		ul.appendChild(li2);
		var a4 = this.configMap.modules['utils'].createElement("a", null, [ { name: 'href', value: window.location.origin + '/#body=contacts'} ]);
		li2.appendChild(a4);
		a4.innerHTML='contacts';

		var form = this.configMap.modules['utils'].createElement('form', ["navbar-form", "navbar-right"]);
		div2.appendChild(form);

		var input = this.configMap.modules['utils'].createElement("input", ["form-control"], 
			[ { name: 'type', value: 'text'}, { name: 'placeholder', value: 'search...'}, { name: 'id', value: 'search'} ]);
		form.appendChild(input);
		this.configMap.modules['utils'].logger.leave(this.name, 'initUi');
	};

	module.prototype.setGuiState = function(state) {
		this.configMap.modules['utils'].logger.enter(this.name, 'setGuiState[' + state + ']');
		if( state == 'item' )
			$( this.stateMap.jqueryMap.$search ).hide();
		else
			$( this.stateMap.jqueryMap.$search ).show();
		this.configMap.modules['utils'].logger.leave(this.name, 'setGuiState');
	} ;

	module.prototype.onEvent = function(event, data){
		this.configMap.modules['utils'].logger.enter(this.name, 'onEvent[' + event + ']');
		if(event == 'onBody')
			this.setGuiState(data.body)
		else
			if(event == 'onContainerDefinition'){
				this.configMap.modules['utils'].logger.info(this.name, 'received container, going to show');
				this.show(data.header);
			}
			
		this.configMap.modules['utils'].logger.leave(this.name, 'onEvent');
	};

	return { module: module };

}());