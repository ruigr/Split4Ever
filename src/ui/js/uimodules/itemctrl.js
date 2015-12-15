var ItemCtrl = (function(){

	var module = function(name){
		base.UIMod.call(this,name);
		this.configMap.events = ['onBody', 'got.item' ];
		this.configMap.requires = ['utils', 'pubsub'];
		this.stateMap.context = {};
	};

	module.prototype = Object.create(base.UIMod.prototype);
	module.prototype.constructor = module;
	

	module.prototype.onEvent = function(event, context){

		this.configMap.modules['utils'].logger.enter(this.name, s.sprintf('onEvent(%s,%s)',event, context));

		if(event == "onBody" && null != context.body && "item" == context.body ) {
			context.container.empty();
			context.mode = 'edit';

			if( ( null != context.id ) && (null == context.mode) ) 
				context.mode = 'view';

			this.configMap.modules['utils'].copyObjProps2Obj(context, this.stateMap.context);
			this.configMap.modules['pubsub'].publish('request.item', context);
		}
		else if ( event == "got.item" ) {
			this.configMap.modules['utils'].copyObjProps2Obj(context, this.stateMap.context);
			this.configMap.modules['pubsub'].publish('display.item', this.stateMap.context);
		}
		else if ( event == 'update.item.name' ) {
			if(null !=  this.stateMap.context.item._id) {
				var newContext = {};
				this.configMap.modules['utils'].copyObjProps2Obj(this.stateMap.context, newContext);
				newContext.item.name = context.value;
				this.configMap.modules['pubsub'].publish('persist.item', newContext);	
			}
			else
				this.stateMap.context.item.name = context.value;
		}
		else if ( event == 'update.item.price' ) {
			var newContext = {};
			this.configMap.modules['utils'].copyObjProps2Obj(this.stateMap.context, newContext);
			newContext.item.price = context.value;	
			this.configMap.modules['pubsub'].publish('persist.item', newContext);
		}
		else if ( event == 'update.item.category' ) {
			var newContext = {};
			this.configMap.modules['utils'].copyObjProps2Obj(this.stateMap.context, newContext);
			newContext.item.category = context.value;	
			this.configMap.modules['pubsub'].publish('persist.item', newContext);
		}
		else if ( event == 'update.item.subCategory' ) {
			var newContext = {};
			this.configMap.modules['utils'].copyObjProps2Obj(this.stateMap.context, newContext);
			newContext.item.subCategory = context.value;	
			this.configMap.modules['pubsub'].publish('persist.item', newContext);
		}
		else if ( event == 'update.item.notes' ) {
			var newContext = {};
			this.configMap.modules['utils'].copyObjProps2Obj(this.stateMap.context, newContext);
			newContext.item.notes = context.value;	
			this.configMap.modules['pubsub'].publish('persist.item', newContext);
		}
		else if ( event == 'remove.item.image' ) {
			
		}
		else if ( event == 'add.item.images' ) {
			
		}

		this.configMap.modules['utils'].logger.leave(module.name, 'onEvent');
	};


	return { module: module };

}());
