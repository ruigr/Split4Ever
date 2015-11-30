var Item = (function(){

	var module = function(name){
		base.UIMod.call(this,name);
		this.configMap.events = ['onBody', 'uievents.model.set.images', 'model.update', 
		'uievents.model.set.category', 'uievents.view.doRenderModel', 'uievents.model.set.subCategory',
		'uievents.model.set.notes', 'uievents.model.set.price', 'uievents.model.set.name',
		'uievents.model.remove', 'uievents.model.persist', 'uievents.model.del.images' ];
		this.configMap.requires = ['api', 'utils', 'pubsub', 'itemview', 'itemmodel'];
	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;

	module.prototype.initModule = function($container){
		this.configMap.modules['pubsub'].subscribe(this.configMap.events, this);
		this.configMap.uicontainer = $container;
	};
	

	module.prototype.onEvent = function(event, data){

		this.configMap.modules['utils'].logger.enter(this.name, s.sprintf('onEvent(%s,%s)',event, data));

		if(event == "onBody" && null != data.body && "item" == data.body ) {
			//we have a ui container thet we should empty everytime
			//we are going to lay down on it
			this.configMap.uicontainer.empty();

			if( (null != data.config) && (null != data.config.id) ){
				if(null == data.config.mode)
					data.config.mode = 'view';//otherwise it is 'edit'
			}
			else {
				data.config = {mode : 'edit'};
			}

			//we are going to display a wait4me until we retrieve the model
			this.configMap.modules['pubsub'].publish('wait4me', 
					{container: this.configMap.uicontainer, state: true });
			//init view
			this.configMap.modules['itemview'].init(
				this.configMap.uicontainer, data.config.mode);
			//init model
			this.configMap.modules['itemmodel'].init(data.config.id);

		}

		if(event == 'uievents.model.set.images'){
			this.configMap.modules['itemmodel'].set('images', data);
		}

		if(event == 'uievents.model.set.category'){
			this.configMap.modules['itemmodel'].set('category', data);
		}

		if(event == 'uievents.model.del.images'){
			this.configMap.modules['itemmodel'].set('images', null);
		}

		if(event == 'uievents.model.set.subCategory'){
			this.configMap.modules['itemmodel'].set('subCategory', data);
		}

		if( event == 'uievents.view.doRenderModel'){
			var model = this.configMap.modules['itemmodel'].get();
			this.configMap.modules['itemview'].render(model);
		}

		if(event == 'uievents.model.set.notes'){
			this.configMap.modules['itemmodel'].set('notes', data);
		}
		if(event == 'uievents.model.set.price'){
			this.configMap.modules['itemmodel'].set('price', data);
		}
		if(event == 'uievents.model.set.name'){
			this.configMap.modules['itemmodel'].set('name', data);
		}
		if(event == 'uievents.model.persist'){
			this.configMap.modules['itemmodel'].persist();
		}
		if(event == 'uievents.model.remove'){
			this.configMap.modules['itemmodel'].remove();
		}

		if( event == 'model.update'){
			this.configMap.modules['itemview'].render(data);
			this.configMap.modules['pubsub'].publish('wait4me', 
					{container: this.configMap.uicontainer, state: false });
		}
		
		
		this.configMap.modules['utils'].logger.leave(module.name, 'onEvent');
	};


	return { module: module };

}());
