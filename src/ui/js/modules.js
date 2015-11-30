



var Data = (function(){

	var module = function(name){
		base.Mod.call(this,name);
		this.stateMap = {
			anchor_map : {				
			}	
		}; 
		this.configMap.events = ['retrieveData'];		
	};

	module.prototype = Object.create(base.Mod.prototype);
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


