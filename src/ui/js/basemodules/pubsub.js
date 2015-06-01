
var pubsub = (function() {

	var eventSubscribers = {},
	//functions
	subscribe, unsubscribe, publish;

	subscribe = function(events, subscriber){
		var ev = null, subs= null, subscribers = null;
		for(i=0 ; i<events.length;i++){
			ev=events[i];
			subs=null;
			if(null == (subs=eventSubscribers[ev])){
				eventSubscribers[ev] = (subs=new Array());
			}
			subscribers = eventSubscribers[ev];
			subscribers[subscribers.length] = subscriber;	
		}
	};

	unsubscribe = function(events, subscriber){
		var ev = null, subs = null;
		for(i=0 ; i<events.length;i++){
			ev=events[i]
			subs=null;
			var index = -1;
			if(null != (subs=eventSubscribers[ev])){
				if(-1 < (index = subs.indexOf(subscriber))){
					subs.splice(index,1)
				}
			}
		}
		
	};

	publish = function(event, data){
		var subs = null;
		if(null != (subs = eventSubscribers[event]) )
			for(i=0;i<subs.length;i++)
				subs[i].onEvent(event,data)
		
	};

	return { subscribe: subscribe, 
		unsubscribe: unsubscribe, 
		publish: publish };

}());

var Event = (function() {
	
	
		
}());

