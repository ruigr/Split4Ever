

var browse = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.active = false;
		this.configMap = {
			events: ['onBody'],
			main_html : "<div class='browse'></div>",
			item_html : '<img src="{0}}"></img>'
		}; 
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.wrapData = function(dataitem){
		return this.configMap.item_html.format(dataitem.image);
	};

	module.prototype.loadData = function(img){
		
		wrap = this.wrapData(img);
		this.stateMap.jqueryMap.$browser.append(img);
		
	};
	
	module.prototype.onEvent = function(event, data){

		if(event == "onBody" && null != data.body && data.body == "browse"){
			if(!this.isActive()){
				this.configMap.container.html(this.configMap.main_html);
				this.setActive(true);
				this.setJqueryMap(this.configMap.container);
				pubsub.publish( 'retrieveData', this.loadData);
				this.setEvents();
			}
		}
		else {
				if(this.isActive()){
					this.stateMap.jqueryMap.$browser.remove();
					this.setJqueryMap(null);
					this.setActive(false);
				}
		}
		console.log("Mod.prototype.onEvent not implemented");
	};



	module.prototype.setJqueryMap = function($container){
		if(null != $container){
			this.stateMap.jqueryMap = {
				$container : this.configMap.container,
				$browser: $container.find('.browse'),
				$msg : $container.find('.msg')
			};
		}
		else {
			this.stateMap.jqueryMap = {};
		}
	};

	module.prototype.initModule = function($container){
		pubsub.subscribe(this.configMap.events, this);
		this.configMap.container = $container;
	};

	return { module: module };

}());

var Data = (function(){

	var module = function(name){
		common.Mod.call(this,name);
		this.stateMap = {
			anchor_map : {				
			}	
		}; 
		this.configMap.events = ['retrieveData'];		
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;

	module.prototype.onEvent = function(event, data){
		
		if('retrieveData' == event){
			this.findData(data);
		}

	};

	module.prototype.data2Object = function(fileURL,callback) {

	    var img = new Image();
	    img.src = fileURL;
	    img.setAttribute('crossOrigin', 'anonymous');
	    var obj={};
	    obj["name"]=fileURL;
	    img.onload = function () {
		    var canvas = document.createElement("canvas");
		    canvas.width =this.width;
		    canvas.height =this.height;
		    var ctx = canvas.getContext("2d");
		    ctx.drawImage(this, 0, 0);
		    var dataURL = canvas.toDataURL("image/jpg");
		    obj["image"]=dataURL.replace(/^data:image\/(png|jpg);base64,/, "")
		    callback(obj);
	    }
	}

	module.prototype.findData = function(callback){
		var files = [
		"http://www.gravatar.com/avatar/0e39d18b89822d1d9871e0d1bc839d06?s=128&d=identicon&r=PG"
		,"http://www.gravatar.com/avatar/0e39d18b89822d1d9871e0d1bc839d06?s=128&d=identicon&r=PG"
		];
		for(i=0;i<files.length;i++){
			this.data2Object(files[i],callback)
		}
	
     
	}


	return { module: module };

}());


