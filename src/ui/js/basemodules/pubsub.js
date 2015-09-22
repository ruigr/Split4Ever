var PubSub = (function() {

	var module = function(name){
		common.Mod.call(this,name);
		this.configMap.requires = ['utils'];
		this.stateMap.eventSubscribers = {};
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;

	module.prototype.subscribe = function(events, subscriber){
		this.configMap.modules['utils'].logger.enter(this.name, 'subscribe');
		var ev = null, subs= null, subscribers = null;
		for(var i=0 ; i<events.length;i++){
			ev=events[i];
			subs=null;
			if(null == (subs=this.stateMap.eventSubscribers[ev])){
				this.stateMap.eventSubscribers[ev] = (subs=new Array());
			}
			subscribers = this.stateMap.eventSubscribers[ev];
			subscribers[subscribers.length] = subscriber;	
		}
		this.configMap.modules['utils'].logger.leave(this.name, 'subscribe');
	};

	module.prototype.unsubscribe = function(events, subscriber){
		this.configMap.modules['utils'].logger.enter(this.name, 'unsubscribe');
		var ev = null, subs = null;
		for(var i=0 ; i<events.length;i++){
			ev=events[i]
			subs=null;
			var index = -1;
			if(null != (subs=this.stateMap.eventSubscribers[ev])){
				if(-1 < (index = subs.indexOf(subscriber))){
					subs.splice(index,1)
				}
			}
		}
		this.configMap.modules['utils'].logger.leave(this.name, 'unsubscribe');
	};

	//asynchronous function by default
	module.prototype.publish = function(event, data, doAsynch){

		this.configMap.modules['utils'].logger.enter(this.name, 'publish');

		this.configMap.modules['utils'].logger.log(this.name, 'publishing event: ' + event);
		var subs = this.stateMap.eventSubscribers[event];
		if(null != subs && Array.isArray(subs) ){
			for( var i = 0; i < subs.length; i++){
				var subscriber = subs[i];

				if(false === doAsynch){
					subscriber.onEvent(event,data);
				}
				else {
					var func = function(sub, event, data){
						var run = function(){
							sub.onEvent(event,data);
						};
						return {run: run};
					}(subscriber, event, data);

					this.configMap.modules['utils'].async( func.run, null );
				}
			}
		}
		
		this.configMap.modules['utils'].logger.leave(this.name, 'publish');
	};


	return { module: module};

}());

