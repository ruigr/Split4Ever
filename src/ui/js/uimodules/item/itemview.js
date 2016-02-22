var ItemView = (function(){

	var module = function(name){

		base.UIMod.call(this,name);
		this.configMap.events = [ 'display.item' ]; 
		this.configMap.requires = ['utils', 'pubsub', 'api', 'constants', 
		'itemformwidget', 'itemformevents', 'itemformloader'];
		this.configMap.uicontainer = null;
		this.stateMap.context = null;
		this.stateMap.jqueryMap = null ;

	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.onEvent = function(event, context){
		
		if ( event == 'display.item' ) {
			this.setContext(context);
			this.show();
			
		}
	};


/*	module.prototype.render = function(o){
		this.configMap.modules['itemrender'].render(o);
		
	};

	module.prototype.init = function($container, mode){
		this.configMap.uicontainer = $container;
		this.stateMap.mode = mode;
		this.initUi();
		this.setJqueryMap();
		this.configMap.modules['itemrender'].init(this.stateMap);
		this.configMap.modules['itemuievents'].init(this.stateMap);
	};*/

	module.prototype.show = function(){
		
		/*
			lay out the widgets
			add events (validation and submission)
			load model on ui
		*/
		this.validateContext();
		this.configMap.uicontainer = this.stateMap.context.container;
		this.configMap.uicontainer.empty();

		this.configMap.modules['itemformwidget'].setContext(this.stateMap.context);
		this.configMap.modules['itemformwidget'].initUI();
		this.stateMap.context.jqueryMap = this.configMap.modules['itemformwidget'].getJqueryMap();
		this.configMap.modules['itemformevents'].setContext(this.stateMap.context);
		this.configMap.modules['itemformevents'].setEvents();
		
		this.configMap.modules['itemformloader'].setContext(this.stateMap.context);
		this.configMap.modules['itemformloader'].load();


			

		

	};




	return { module: module };

}());
