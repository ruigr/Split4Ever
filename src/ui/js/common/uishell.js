/*
 * spa.shell.js
 * Shell module for SPA
 */
var UiShell = function(name){
	Module.call(this, name);
	this.config.requires = ['Utils', 'PubSub' ];
	this.config.anchor_schema_map = {};
	this.context.anchor_map = {};
};

UiShell.prototype = Object.create(Module.prototype);
UiShell.prototype.constructor = UiShell;




	/*module.prototype.setEvents = function(){
		this.config.modules['utils'].logger.enter(this.name, 'setEvents');

		this.config.modules['utils'].logger.info(this.name, 'setting up hashChange events');
		var hashChangeCallBack = (function(context, config) {

			var context = context;
			var config = config;

			// Returns copy of stored anchor map; minimizes overhead
			var copyAnchorMap = function() {
				return $.extend(true, {}, context.anchor_map);
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
				context.anchor_map = anchor_map_proposed;
				config.modules['utils'].logger.info('onHashChange', 'setting anchor_map: ' + context.anchor_map);
				//so we have an anchor map, if no body then set body to browse module by default
				if(null == context.anchor_map.body){
					$.uriAnchor.setAnchor(
					{	
						body : 'browser' ,
						_body : {searchtext   : ''}
					});
					return false;
				};

				var context = {};
				context = config.modules['utils'].copyObjProps2Obj(context.anchor_map['_body'], context);
				context['body']=context.anchor_map.body;
				context['container']=context.jqueryMap.$body;

				config.modules['pubsub'].publish('onBody', context);

				return false;
			};

			return {
				onChange: onChange
			};

		})( this.context, this.config );


			//send event defining header and footer containers, 
			//header and footer modules should react to this
		this.config.modules['utils'].logger.info(this.name, 'going to send header and footer definition');
		var context = {
			header: this.context.jqueryMap.$header,
			footer: this.context.jqueryMap.$footer
		}
		this.config.modules['pubsub'].publish('onContainerDefinition', context);

		this.config.modules['utils'].logger.info(this.name, 'triggering initial hashchange');
		$(window).bind('hashchange', hashChangeCallBack.onChange ).trigger('hashchange');
		$.uriAnchor.makeAnchorMap();

		this.config.modules['utils'].logger.leave(this.name, 'setEvents');
	};*/



