
var Utils = (function() {

	var module = function(name){
		base.Mod.call(this,name);
	};

	module.prototype = Object.create(base.Mod.prototype);
	module.prototype.constructor = module;


	module.prototype.logger = (function(){
		var print = function(moduleName, message){
			console.log("[" + new Date().toUTCString() + " | " + moduleName + "]"  + message);
		};
		var enter  = function(moduleName, method){
			print(moduleName, "<IN> " + method);
		};
		var leave  = function(moduleName, method){
			print(moduleName, "<OUT> " + method);
		};
		var log = function(moduleName, msg){
			print(moduleName, '<LOG> ' +msg);
		};
		var error = function(moduleName, msg){
			print(moduleName, '<ERROR> ' + msg);
		};
		var warn = function(moduleName, msg){
			print(moduleName, '<WARNING> ' + msg);
		};
		var info = function(moduleName, msg){
			print(moduleName, '<INFO> ' + msg);
		};
		
		return {
			enter: enter,
			leave: leave,
			log: log
			, error: error
			, warn: warn
			, info: info
		};

	})();


	module.prototype.readFileAsBase64 = function(file, callback){
		var reader = new FileReader();
		reader.onload = function(event){
			var data = event.target.result.replace("data:"+ file.type +";base64,", '');
			callback(data, file);
		};
		reader.readAsDataURL(file);
	};

	module.prototype.stopUiDefaultEvents = function(evt){

    	evt.stopPropagation();
		evt.preventDefault();

    };

	module.prototype.copyObjProps2Obj = function(source, destination){

		if( null != source ) {
			for(prop in source){
				if(source.hasOwnProperty(prop))
					destination[prop] = source[prop]
			}
		}
		return destination;
    };	

    module.prototype.async = function(func, callback){

    	setTimeout(function(){
    		func();
    		if(null != callback)
    			callback();
    	}, 0);

    };
    
    module.prototype.createElement = function(elementType, classesArray, attributesArray){

		var element = document.createElement(elementType);

		if(classesArray) {
			classesArray.forEach(
				function(item){
					element.classList.add(item);
				}
			);
		}
		
		if(attributesArray){
			attributesArray.forEach(
				function(item){
					element.setAttribute(item.name, item.value);
				}
			);
		}
		return element;
	};

    module.prototype.cookieManager = function(){

    	var getItem = function (sKey) {
		    if (!sKey) { return null; }
		    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
		  };

		var setItem= function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
		    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
		    var sExpires = "";
		    if (vEnd) {
		      switch (vEnd.constructor) {
		        case Number:
		          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
		          break;
		        case String:
		          sExpires = "; expires=" + vEnd;
		          break;
		        case Date:
		          sExpires = "; expires=" + vEnd.toUTCString();
		          break;
		      }
		    }
		    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
		    return true;
		  };

		  var removeItem = function (sKey, sPath, sDomain) {
		    if (!this.hasItem(sKey)) { return false; }
		    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
		    return true;
		  };
		  var hasItem = function (sKey) {
		    if (!sKey) { return false; }
		    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		  };
		  var keys = function () {
		    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
		    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
		    return aKeys;
		  };

		  return {
		  	getItem: getItem, setItem: setItem, removeItem: removeItem,
		  	hasItem: hasItem, keys: keys
		  };

    }();

	return { module: module};

}());
