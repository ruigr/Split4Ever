//mongodb://username:password@hostname:port/database
var PragmaLogger = require('pragma-logger');
var custom = require('./custom.js');
var mongolib = require('mongodb');
var ObjectID = mongolib.ObjectID;
var mongoClient = mongolib.MongoClient;
var util = require('util');
var assert = require('assert');


var Model = (function(){

	var DB_CONNECT_STRING = 'mongodb://app:password@localhost:27017/vwparts';
	var logger = custom.createLogger('model');
	var collectionMap = {};
	var connection = null;

	var delCollection = function(collectionName, callback){

		var dropCallback = function(error, result){
			if(error) {
				logger.error(error);
				if(callback)
					callback.nok(JSON.parse(error));
			}
			else {
				var o = JSON.parse(result);
				logger.info(util.format('dropped collection %s', collectionName));
				if(callback)
					callback.ok(o);
			}
		};

		connection.dropCollection(collectionName, dropCallback)

	};

	var init = function(collections, initCallback) {
		if(!Array.isArray(collections))
			throw 'must provide array with collection names';

		var connectionString = DB_CONNECT_STRING;
		if(process.env.DB_CONN_STR)
				connectionString = process.env.DB_CONN_STR;

		if(custom.areWeOnBluemix() && custom.doWeHaveServices()){
			connectionString = custom.getMongoConnectString();
			if(custom.areWeOnDocker()){
				logger.info('...waiting for bluemix network to pop up...');
				custom.sleep(120000);
				logger.info('...resuming now');	
			}
		};

		var callback = (function(cb){
			var f = function(err, db){
				if(null != err) {
					logger.error(err);
					if(null != cb)
						cb.nok(err);
				}
				else {
					logger.info('...connected to db !;-)');
					connection = db;
					for( i = 0; i < collections.length; i++){
						var collection = collections[i];
						connection.createCollection(collection, {}, 
							function(err,c){
								if(null != err)
									logger.error(' !!! error creating collection: ' + collection);
								else{
									collectionMap[collection] = c;
									logger.info('...created collection: ' + collection);
								}
								logger.info(util.format('collection map has now %d elements', Object.keys(collectionMap).length));
							}
						);
						custom.sleep(1000);
					}
					

					if(null != cb)
						cb.ok();
				}
			};
			return { f: f };
		})(initCallback);
		logger.info('going to connect to db in: ' + connectionString);
		mongoClient.connect(connectionString, callback.f);

	};


	var getAll  = function(collectionName, callback) {

		logger.trace('@Model.getAll');
		var cursor = collectionMap[collectionName].find();
		var result = [];

		cursor.each(function(err, item) {
			if (err) {
	  			console.error(err);
	  		}

	    	if (item != null) 
	    		result.push(item);
	    	else
	    		callback.ok(result);

	   	});
		

		logger.trace('Model.getAll@');
	};

	//returns a result object or an error
	/* result: 
		ok	Number	Is 1 if the command executed correctly.
		n	Number	The total count of documents deleted.
	*/
	var delAll = function(collectionName, callback) {

		logger.trace('@Model.delAll');
		
		var delCallback = function(error, result){
			if(error) {
				logger.error(error);
				if(callback)
					callback.nok(JSON.parse(error));
			}
			else {
				var o = JSON.parse(result);
				if( o.ok == 1 )
					logger.info(util.format('deleted %d elements', o.n));
				else
					logger.info(util.format('delAll was not successful [ok: %d deleted: %d]', o.ok, o.n));
				
				if(callback)
					callback.ok(o);
			}
		};

		collectionMap[collectionName].deleteMany({}, delCallback);
		logger.trace('Model.delAll@');		
	};

	/*
		returns  id or err

	*/
	var post = function(collectionName, o, callback) {
		logger.trace('@Model.post');
		var id = null;

		var postCallback = function(callback, objId){

			var f = function(err,r){
				if (err) {
				  	logger.error(err);
					if(callback)
						callback.nok(JSON.parse(err));
				}
				else {
					var o = JSON.parse(r);
					if( o.ok == 1 ){
				  		logger.info(util.format('inserted %d elements in collection %s', o.n, collectionName));
				  		if(callback)
							callback.ok(objId);
					}
				  	else {
				  		logger.info(util.format('result %d when inserting elements in collection %s', o.ok, collectionName));
				  		if(callback)
				  			callback.nok(JSON.parse(new Error('insert was not ok')));
				  	}
				}
			};

			return {
				f:f
			};

		};

		if(! o._id ) {
			id = new ObjectID();
			o._id = id;
			var c = postCallback(callback, id);
			collectionMap[collectionName].insertOne(o, c.f );
		}
		else {			
			id = new ObjectID(o._id);
			o._id = id;
			var c = postCallback(callback, id);
			collectionMap[collectionName].replaceOne(
				{'_id' : o._id}, o, c.f );
		}

		logger.trace('Model.post@');
	};


	return { 
		getAll: getAll
		, init: init
		, delAll: delAll
		, post: post
		, delCollection: delCollection
		/*
		,getCollection: getCollection
		,post2Collection: post2Collection
		,get: get
		,del: del*/
	}; 

}());

module.exports = Model;

	/*

	var get  = function(idVal, callback) {
		custom.log('@Model.get[' + idVal  + ']');

		var cursor = dbcnx.get().collection('items').find({'_id': new ObjectID(idVal)});
		var result = null;
		cursor.each(function(err, item) {
			if (err) {
	  			console.error(err);
	  		}
			custom.log('item: ' + item);
	    	if (item != null) 
	    		result = item;
	    	else
	    		callback.ok(result);

	   	});
		console.log('Model.get@');
	};

	var getCollectionMember  = function(collection, idVal, callback) {
		custom.log('@Model.getCollectionMember[' + collection  + ',' + idVal + ']');

		var cursor = dbcnx.get().collection(collection).find({'_id': new ObjectID(idVal)});
		var result = null;
		cursor.each(function(err, item) {
			
			if (err) {
	  			console.error(err);
	  			callback.nok(err);
	  		}
	  		else {

	  		}
			
	    	if (item != null) {
	    		result = item;
	    		custom.log(collection + ':member._id: ' + item._id);
	    	}
	    	else //this will stop when we have a null
	    		callback.ok(result);

	   	});
		console.log('Model.getCollectionMember@');
	};

	var del = function(id, callback) {
		custom.log('@Model.del');
		dbcnx.get().collection('items').deleteOne(
			{'_id': new ObjectID(id)},
			function(err,result){
				if (err) {
	  				console.error(err);
	  				callback.nok(null);
	  			}
	  			else {
	  				console.log('result:' + util.inspect(result));
	  				console.log('item del successful');
	  				callback.ok(result);
	  			}
			}
		);
		console.log('Model.del@');		
	};

	var getCollection  = function(collectionName, callback) {

		console.log('@Model.getCollection[%s]', collectionName);
		var cursor = dbcnx.get().collection(collectionName).find();
		var result = [];

		cursor.each(function(err, o) {

			if (err) {
	  			console.error(err);
	  		}

	    	if (o != null) 
	    		result.push(o);
	    	else
	    		callback.ok(result);

	   	});

		console.log('Model.getCollection@');
	};

	var post2Collection = function(collectionName, o, callback) {
		custom.log('@Model.post2Collection[%s]', collectionName);

		var statementCallback = function(cb, objId){
			var _callback = cb;
			var _id = objId;

			var func = function(err,result){
				if (err) {
				  		console.error(err);
				  		_callback.nok(err);
				  	}
				  	else {
				  		console.log('pots successful with id: ' + _id.toString() );
				  		_callback.ok(_id.toString());
				  	}
			};
			return {
				func:func
			};
		};

		if(! o._id ) {
			o._id = new ObjectID();
			dbcnx.get().collection(collectionName).insertOne(o, statementCallback(callback, o._id ).func );
		}
		else {			
			o._id = new ObjectID(o._id);
			dbcnx.get().collection(collectionName).replaceOne(
				{'_id' : o._id}, o, statementCallback(callback, o._id).func );
		}
		custom.log('Model.post2Collection@');
	};



	var postMultiple2Collection = function(collectionName, os, callback) {
		custom.log('@Model.postMultiple2Collection[%s]', collectionName);

		var localCb = function(cb ,ids){
			var func = function(err,result){
				if (err) {
				  		console.error(err);
				  		cb.nok(err);
				  	}
				  	else {
				  		console.log('posts successful: ' +  result.insertedCount );
				  		cb.ok(ids);
				  	}
			};

			return {
				func:func
			};
		};



		var filter = [];
		os.forEach(function(el){
			if(! el._id)
				el._id = new ObjectID();

			filter.push({_id: el._id});
		});
		dbcnx.get().collection(collectionName).updateMany(filter, os, {upsert: true}, localCb( callback, filter ).func );

		custom.log('Model.postMultiple2Collection@');
	};*/


