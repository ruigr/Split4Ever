
var Utils = function(name){
	Module.call(this, name);
};

Utils.prototype = Object.create(Module.prototype);
Utils.prototype.constructor = Utils;

Utils.prototype.init = function(){
	Module.prototype.init.call(this);
	this.logger.in('init');
	

	if( null == s )
		this.throw('!!! Utils module requires underscore.string.js global external library !!!');
	this.logger.out('init');
};

Utils.prototype.printf = function(msg, varArr){
	var args = [];
	args.concat(msg, varArr);
	s.sprintf.apply(this, args);
};

Utils.prototype.readFileAsBase64 = function(file, callback){
	var reader = new FileReader();
	reader.onload = function(event){
		var data = event.target.result.replace("data:"+ file.type +";base64,", '');
		callback(data, file);
	};
	reader.readAsDataURL(file);
};

Utils.prototype.stopUiDefaultEvents = function(evt){

	evt.stopPropagation();
	evt.preventDefault();

};

Utils.prototype.copyObjProps2Obj = function(source, destination){

	if( null != source ) {
		for(prop in source){
			if(source.hasOwnProperty(prop))
				destination[prop] = source[prop]
		}
	}
	return destination;
};	

Utils.prototype.async = function(func, callback){

	setTimeout(function(){
		var result = func();
		if(null != callback)
			callback(result);
	}, 0);

};


Utils.prototype.createElement = function(elementType, classesArray, attributesArray){

	var element = document.createElement(elementType);

	if(null != classesArray) {
		classesArray.forEach(
			function(item){
				element.classList.add(item);
			}
		);
	}
	
	if(null != attributesArray){
		attributesArray.forEach(
			function(item){
				element.setAttribute(item.name, item.value);
			}
		);
	}
	return element;
};

Utils.prototype.cookieManager = function(){

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


