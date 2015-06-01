/*
 * spa.shell.js
 * Shell module for SPA
 */

var uishell = (function() {
	// ---------------- BEGIN MODULE SCOPE VARIABLES --------------
	//configuration
	var configMap = {
		//anchor_schema_map : { body: 'browse' },
		anchor_schema_map : {},
		main_html : String() + 
		'<div class="header container-fluid"></div>' + 
		'<div class="body container-fluid"></div>' + 
		'<div class="footer container-fluid"></div>',
		modules : new Array()
	}, 
	//state
	stateMap = {
		anchor_map : {},
		jqueryMap : {}
	}, 
	copyAnchorMap, setJqueryMap, onHashchange,
	// functions
	/*
		 toggleModule, changeAnchorPart,  
	*/
	initModule, loadModules;
	
	// ------------------- BEGIN PRIVATE METHODS -------------------

	setJqueryMap = function($container) {
		stateMap.jqueryMap = {
			$container : $container,
			$header : $container.find('.header'),
			$body : $container.find('.body'),
			$footer : $container.find('.footer')
		};
	};

	loadModules = function() {
		
		var apiModule = null;
		
		//init modules
		for (index = 0; index < configMap.modules.length; ++index) {

	    	var module = configMap.modules[index];
	    	
	    	//save a reference for the api module
	    	if(module.name == 'api')
	    		apiModule = module;

	    	if (module instanceof common.UIMod){
	    		
	    		if(	module.getName() == 'header'){
	    			module.initModule(stateMap.jqueryMap.$header);
	    			continue
	    		} 
	    		else if (module.getName() == 'footer'){
					module.initModule(stateMap.jqueryMap.$footer);
					continue
		    	} 
		    	else {
					module.initModule(stateMap.jqueryMap.$body);
		    		continue
		    	}
		    		
	    	}
	    	else {
	    		module.initModule(null);
		    	continue
	    	}

	    	
		}

		if(apiModule){
			for (index = 0; index < configMap.modules.length; ++index) {	
				var module = configMap.modules[index];	
				if(module.requires('api'))
					module.setApi(apiModule);
			}
		}
		

	};

	// Returns copy of stored anchor map; minimizes overhead
	copyAnchorMap = function() {
		return $.extend(true, {}, stateMap.anchor_map);
	};

	onHashchange = function(event) {
		console.log('onHashChange')
		//get current anchor map
		var anchor_map_previous = copyAnchorMap(), 
		anchor_map_proposed;
		//#!page=profile:uname,wendy|online,today&slider=confirm:text,hello|pretty,false&color=red 
		//#!body=browse:text,amortece
		
		// attempt to parse anchor
		try {
			anchor_map_proposed = $.uriAnchor.makeAnchorMap();
		} catch (error) {
			$.uriAnchor.setAnchor(anchor_map_previous, null, true);
			return false;
		}
		stateMap.anchor_map = anchor_map_proposed;
		//so we have an anchor map
		//console.log('anchor map: ' + stateMap.anchor_map);

		//body
		//if no body then set body to browse module by default
		if(null == stateMap.anchor_map.body){
			$.uriAnchor.setAnchor(
			{	
				//body : 'browse'
				//,_body : {searchtext   : ''}
				body : 'item'
				,_body : {id   : 0, name: 's'}

			});

			return false;
		}
		data = {}
		data['body']=stateMap.anchor_map.body
		data['config']=stateMap.anchor_map['_body']

		pubsub.publish( 'onBody', data);

		return false;
	};


	// ------------------- BEGIN PUBLIC METHODS -------------------

	initModule = function($container, modules) {

		configMap.modules = modules;
		$container.html(configMap.main_html);
		setJqueryMap($container);
		loadModules();
		// configure uriAnchor to use our schema
		/*

		$.uriAnchor.configModule({
			schema_map : configMap.anchor_schema_map
		});
		*/
		$(window).bind('hashchange', onHashchange).trigger('hashchange');

		$.uriAnchor.makeAnchorMap();


	};

	return {
		initModule : initModule
	};

	// ------------------- END PUBLIC METHODS ---------------------

	
}());
