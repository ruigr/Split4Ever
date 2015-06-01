var Header = (function(){

	var module = function(name){
		common.UIMod.call(this,name);
		this.configMap.main_html = 
		'<div class="row">' +
			'<div class="col-xs-12 col-sm-6"><img src="img/header.png" class="img-rounded"/></div>' +
			'<div class="col-xs-6 col-sm-3">' +
				'	<input type="text" class="form-control" id="search" placeholder="..."/>' +
			'</div>' +
			'<div class="col-xs-6 col-sm-3">' +
				'	<button type="submit" class="btn btn-default">search</button>' +
			'</div>' +
		'</div>';
	};

	module.prototype = Object.create(common.UIMod.prototype);
	module.prototype.constructor = module;
	
	module.prototype.setJqueryMap = function($container){

		this.stateMap.jqueryMap = {
			$container : $container,
			$msg : $container.find('.msg')
		};

	};

	module.prototype.setEvents = function(){
		this.stateMap.jqueryMap.$msg.click(function(){
			alert("msg")
		});
	};
	return { module: module };

}());