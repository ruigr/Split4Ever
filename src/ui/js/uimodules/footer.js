var Footer = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.configMap.main_html = '<hr class="bottom-hr"/>' + 
			'<p class="pull-right"><small><em>vwparts&copy;2015</em></small></p>';

	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.setJqueryMap = function(){

		this.stateMap.jqueryMap = {
			$container : this.configMap.uicontainer,
			$msg : this.configMap.uicontainer.find('.msg')
		};


	};
	module.prototype.setEvents = function(){
		this.stateMap.jqueryMap.$msg.click(function(){
			alert("msg")
		});
	};
		return { module: module };

}());