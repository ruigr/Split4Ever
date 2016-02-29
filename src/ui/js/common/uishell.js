/*
 * spa.shell.js
 * Shell module for SPA
 */
var UiShell = function(name){
	Module.call(this, name);
	this.configMap.requires = ['utils', 'pubsub' ];
	this.configMap.anchor_schema_map = {};
	this.stateMap.anchor_map = {};
};

UiShell.prototype = Object.create(Module.prototype);
UiShell.prototype.constructor = UiShell;

UiShell.prototype.init = function(){
	Module.prototype.init.call(this);
	this.logger.in('init');
	this.logger.out('init');
};

UiShell.prototype.run = function(){
	this.createUI();
	this.setJqueryMap();
};

UiShell.prototype.createUI = function(){
	this.logger.in('createUI');
	var utils = this.configMap.modules['utils'];
	var container = $( this.stateMap.context.container );
	var nav = utils.createElement('nav', ["navbar", "navbar-default", "navbar-fixed-top", "navbar-default-o"]);
	container.append(nav);
	var headerDiv = utils.createElement('div', ["container"], [ { name: 'id', value: 'header' } ]);
	nav.appendChild(headerDiv);
	var bodyDiv = utils.createElement('div', ["container"], [ { name: 'id', value: 'body' } ]);
	container.append(bodyDiv);
	var footer = utils.createElement('footer',  ["footer"]);
	container.append(footer);
	var footerDiv = utils.createElement('div', ["container"], [ { name: 'id', value: 'footer' } ]);
	footer.appendChild(footerDiv);
	this.logger.out('createUI');
};

UiShell.prototype.setJqueryMap = function(){
	var container = $( this.stateMap.context.container );
	this.stateMap.jqueryMap = {
		$header : container.find('#header'),
		$body : container.find('#body'),
		$footer : container.find('#footer')
	};
};

	/*module.prototype.setEvents = function(){
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


			//send event defining header and footer containers, 
			//header and footer modules should react to this
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
	};*/



