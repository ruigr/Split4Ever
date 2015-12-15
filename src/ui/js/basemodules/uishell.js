/*
 * spa.shell.js
 * Shell module for SPA
 */
var UiShell = (function() {

	var module = function(name){
		base.UIMod.call(this,name);
		this.configMap.requires = ['utils', 'pubsub' ];
		this.configMap.anchor_schema_map = {};
		this.stateMap.anchor_map = {};

	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;

	
	module.prototype.initUI = function(){
		this.configMap.modules['utils'].logger.enter(this.name, 'initUI');
		var nav = this.configMap.modules['utils'].createElement('nav', 
			["navbar", "navbar-default", "navbar-fixed-top", "navbar-default-o"]);
		$( this.configMap.uicontainer ).append(nav);
		var headerDiv = this.configMap.modules['utils'].createElement('div', 
			["container"], [ { name: 'id', value: 'header' } ]);
		nav.appendChild(headerDiv);
		var bodyDiv = this.configMap.modules['utils'].createElement('div', 
			["container"], [ { name: 'id', value: 'body' } ]);
		$( this.configMap.uicontainer ).append(bodyDiv);
		var footer = this.configMap.modules['utils'].createElement('footer', 
			["footer"]);
		$( this.configMap.uicontainer ).append(footer);
		var footerDiv = this.configMap.modules['utils'].createElement('div', 
			["container"], [ { name: 'id', value: 'footer' } ]);
		footer.appendChild(footerDiv);
		this.configMap.modules['utils'].logger.leave(this.name, 'initUI');
	};

	module.prototype.setJqueryMap = function(){
		this.stateMap.jqueryMap = {
			$header : $( this.configMap.uicontainer ).find('#header'),
			$body : $( this.configMap.uicontainer ).find('#body'),
			$footer : $( this.configMap.uicontainer ).find('#footer')
		};
	};


	module.prototype.setEvents = function(){
		this.configMap.modules['utils'].logger.enter(this.name, 'setEvents');

		this.configMap.modules['utils'].logger.info(this.name, 'setting up hashChange events');
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
				configmap.modules['utils'].logger.info('onHashChange', 'setting anchor_map: ' + statemap.anchor_map);
				//so we have an anchor map, if no body then set body to browse module by default
				if(null == statemap.anchor_map.body){
					$.uriAnchor.setAnchor(
					{	
						body : 'browser' ,
						_body : {searchtext   : ''}
					});
					return false;
				};

				var context = {};
				context = configmap.modules['utils'].copyObjProps2Obj(statemap.anchor_map['_body'], context);
				context['body']=statemap.anchor_map.body;
				context['container']=statemap.jqueryMap.$body;

				configmap.modules['pubsub'].publish('onBody', context);

				return false;
			};

			return {
				onChange: onChange
			};

		})( this.stateMap, this.configMap );

		/* 
			send event defining header and footer containers, 
			header and footer modules should react to this
		*/
		this.configMap.modules['utils'].logger.info(this.name, 'going to send header and footer definition');
		var context = {
			header: this.stateMap.jqueryMap.$header,
			footer: this.stateMap.jqueryMap.$footer
		}
		this.configMap.modules['pubsub'].publish('onContainerDefinition', context);

		this.configMap.modules['utils'].logger.info(this.name, 'triggering initial hashchange');
		$(window).bind('hashchange', hashChangeCallBack.onChange ).trigger('hashchange');
		$.uriAnchor.makeAnchorMap();

		this.configMap.modules['utils'].logger.leave(this.name, 'setEvents');
	};

	return { module: module};

}());

