/*
 * spa.shell.js
 * Shell module for SPA
 */
var UiShell = (function() {

	var module = function(name){
		common.UIMod.call(this,name);
		this.configMap.requires = ['utils', 'pubsub',
			'header','footer','item','api',
			'browse','browseui', 'wait4me', 'itemview', 'itemmodel',
			'itemrender', 'imagerender', 'itemuievents', 'constants' ];
		this.configMap.anchor_schema_map = {};
		this.stateMap.anchor_map = {};

	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.initModule = function($container){
		//this.configMap.modules['pubsub'].subscribe(this.configMap.events, this);
		this.configMap.uicontainer = $container;
		this.initUI();
		this.setJqueryMap();
		this.loadModules();
		this.setEvents();
	};
	
	module.prototype.initUI = function(){

		var nav = document.createElement("nav");
		$( this.configMap.uicontainer ).append(nav);
		nav.classList.add("navbar");
		nav.classList.add("navbar-default");
		nav.classList.add("navbar-fixed-top");
		nav.classList.add("navbar-default-o");

		var headerDiv = document.createElement("div");
		nav.appendChild(headerDiv);
		headerDiv.classList.add("container");
		headerDiv.setAttribute('id', 'header');

		var bodyDiv = document.createElement("div");
		$( this.configMap.uicontainer ).append(bodyDiv);
		bodyDiv.classList.add("container");
		bodyDiv.setAttribute('id', 'body');

		var footer = document.createElement("footer");
		$( this.configMap.uicontainer ).append(footer);
		footer.classList.add("footer");

		var footerDiv = document.createElement("div");
		footer.appendChild(footerDiv);
		footerDiv.classList.add("container");
		footerDiv.setAttribute('id', 'footer');

	};

	module.prototype.setJqueryMap = function(){
		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer,
			$header : $( this.configMap.uicontainer ).find('#header'),
			$body : $( this.configMap.uicontainer ).find('#body'),
			$footer : $( this.configMap.uicontainer ).find('#footer')
		};
	};


	module.prototype.setEvents = function(){

		var hashChangeCallBack = (function(stateMap, configMap) {

			var statemap = stateMap;
			var configmap = configMap;

			// Returns copy of stored anchor map; minimizes overhead
			var copyAnchorMap = function() {
				return $.extend(true, {}, statemap.anchor_map);
			};

			var onChange = function(event) {

				var anchor_map_previous = copyAnchorMap(); 
				var anchor_map_proposed;
				//#!page=profile:uname,wendy|online,today&slider=confirm:text,hello|pretty,false&color=red 
				//#!body=browse:text,amortece
				// attempt to parse anchor
				try {
					anchor_map_proposed = $.uriAnchor.makeAnchorMap();
					console.log('proposed anchor: ' + anchor_map_proposed.body);  

				} catch (error) {
					$.uriAnchor.setAnchor(anchor_map_previous, null, true);
					return false;
				}
				statemap.anchor_map = anchor_map_proposed;
				//so we have an anchor map
				//console.log('anchor map: ' + stateMap.anchor_map);
				//body
				//if no body then set body to browse module by default
				if(null == statemap.anchor_map.body){
					$.uriAnchor.setAnchor(
					{	
						body : 'browse'
						,_body : {searchtext   : ''}
						//body : 'item'
						//,_body : {id   : 0, name: 's'}

					});

					return false;
				};
				var data = {};
				data['body']=statemap.anchor_map.body;
				data['config']=statemap.anchor_map['_body'];

				configmap.modules['pubsub'].publish('onBody', data);

				return false;
			};

			return {
				onChange: onChange
			};

		})( this.stateMap, this.configMap );

		$(window).bind('hashchange', hashChangeCallBack.onChange ).trigger('hashchange');
		$.uriAnchor.makeAnchorMap();
	};

	module.prototype.loadModules = function() {
		this.configMap.modules['utils'].logger.enter(this.name, 'loadModules');

		for(modName in this.configMap.modules){
			if(this.configMap.modules.hasOwnProperty(modName)){
				var module = this.configMap.modules[modName];
				if (module instanceof common.UIMod){
		    		if(modName == 'header')
		    			module.initModule(this.stateMap.jqueryMap.$header);
		    		else if (modName == 'footer')
						module.initModule(this.stateMap.jqueryMap.$footer);
			    	else 
						module.initModule(this.stateMap.jqueryMap.$body);	
		    	}
		    	else
		    		module.initModule(null)

	    		this.configMap.modules['utils'].logger.log(this.name, 'loaded module ' + module.name);
			}
		}

		this.configMap.modules['utils'].logger.leave(this.name, 'loadModules');
	};

	
	

	return { module: module};

}());

