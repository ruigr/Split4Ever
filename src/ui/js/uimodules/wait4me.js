var Wait4Me = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.configMap.events = ['wait4me'] ;
		this.configMap.requires = ['pubsub'] ;
		this.stateMap.throbber =  null;
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;
	

	module.prototype.getThrobber = function(){
		if(null == this.stateMap.throbber)
			this.stateMap.throbber = Throbber({
		    size: 50,
		    fade: 1000, // fade duration, will also be applied to the fallback gif
		    //fallback: 'ajax-loader.gif',
		    rotationspeed: 0.5,
		    lines: 12,
		    color: "#333322",
		    strokewidth: 3,
		    alpha: 0.7 // this will also be applied to the gif
		});

		return this.stateMap.throbber;
	};


	module.prototype.setJqueryMap = function(){
		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer
			,$wait4me: $( this.configMap.uicontainer ).find('#wait4me')[0]
			//,$uploadStatus: $( this.configMap.uicontainer ).find('#uploadStatus')[0]
		};
	};

	module.prototype.request = function(on, container){

		this.configMap.uicontainer = container;

		if( on && (!this.stateMap.jqueryMap.$wait4me) ){
			var curtain = document.createElement("div");
			$( container ).append(curtain);
			curtain.setAttribute('style',
			"z-index: 200;background:rgba(255,255,255,0.7);margin: 0;padding: 0;" 
			+ "width:100%;height:100%;"
			//+ "max-width:100%;max-height:100%;" 
			+ "position:fixed;" 
			+ "margin: auto; left: 0; right: 0;"
			+ "top: 0; bottom: 0;"
			+ "overflow: auto;display: table;"
			);
			curtain.setAttribute('id','wait4me');
			var statusWgt = document.createElement("div");
			
			curtain.appendChild(statusWgt);
			statusWgt.setAttribute('id', 'uploadStatus');
			statusWgt.setAttribute('style', "position: relative; display: table-cell;"
    			+ "text-align: center; vertical-align: middle; margin: auto; left: 45%; right: 0;width: 100%;");
			this.setJqueryMap();
			this.getThrobber().appendTo( statusWgt ).start();
		}
		else {
			if( this.stateMap.jqueryMap.$wait4me ){
				this.getThrobber().stop();
				$( this.stateMap.jqueryMap.$wait4me ).empty();
				$( this.stateMap.jqueryMap.$wait4me ).remove();
				this.stateMap.jqueryMap.$wait4me = null;
			}
			
		}

	};

	module.prototype.onEvent = function(event, data){
		if(event == 'wait4me' && null != data){
			if(data && (null != data.container) && (null != data.state)){

				if(data.state === true)
					this.request(true, data.container);
				else 
					this.request(false, data.container);

			}
			 
		}
	};

	module.prototype.initModule = function($container){
		
		if(null != this.configMap.events){
			if(this.configMap.modules.hasOwnProperty('pubsub')){
				var pubsub = this.configMap.modules['pubsub'];
				pubsub.subscribe(this.configMap.events, this);
			}
		}

	};

	return { module: module };

}());
