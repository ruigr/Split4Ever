var PubSub = function(name){
	Module.call(this, name);
	this.configMap.requires = ['utils'];
	this.stateMap.eventSubscribers = {};
};

PubSub.prototype = Object.create(Module.prototype);
PubSub.prototype.constructor = PubSub;

PubSub.prototype.subscribe = function(events, subscriber){
	this.logger.in('subscribe');
	var ev = null, subs= null, subscribers = null;
	var utils = this.configMap.modules['utils'];
	for(var i=0 ; i<events.length;i++){
		ev=events[i];
		subs=null;
		if(null == (subs=this.stateMap.eventSubscribers[ev])){
			this.stateMap.eventSubscribers[ev] = (subs=new Array());
		}
		subscribers = this.stateMap.eventSubscribers[ev];
		subscribers[subscribers.length] = subscriber;	
		utils.printf(['subscriber %s subscribing event %s ', subscriber.getName(), ev]);
	}
	this.logger.out('subscribe');
};

PubSub.prototype.unsubscribe = function(events, subscriber){
	this.logger.in('unsubscribe');
	var utils = this.configMap.modules['utils'];
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
		utils.printf(['subscriber %s unsubscribing event %s ', subscriber.getName(), ev]);
	}
	this.logger.out('unsubscribe');
};

//asynchronous function by default
PubSub.prototype.publish = function(event, data, doAsynch){
	this.logger.in('publish');
	var utils = this.configMap.modules['utils'];
	utils.printf(['publishing event %s with data: %s', event, JSON.stringify(data)]);

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

				utils.async( func.run, null );
			}
		}
	}
	this.logger.out('publish');
};


