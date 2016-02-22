//mongodb://username:password@hostname:port/database
var custom = require('./custom.js');
var mongolib = require('mongodb');
var ObjectID = mongolib.ObjectID;
var mongoClient = mongolib.MongoClient;
var util = require('util');
var assert = require('assert');


var Model = (function(){

	var DB_CONNECT_STRING = 'mongodb://localhost:27017/vwparts';
	var logger = custom.createLogger('model');
	var collectionMap = {};
	var connection = null;

	/*
		callback(err,connection)
	*/
	var getConnection = function(callback){

		if(null === connection){
			
			var createCallback = function(err, db){
				if(err)
					callback(err, null);
				else {
					connection = db;
					logger.info('connected to mongo');
					callback(null, connection);
				}
			};

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
			logger.trace(util.format('going to connect to %s', connectionString));
			mongoClient.connect(connectionString, createCallback);
		}
		else
			callback(null, connection);
	};

	/*
		callback(err,collection)
	*/
	var getCollection = function(collectionName, callback){

		var createCallback = function(err, conn){
			if(err)
				callback(err, null);
			else {
				conn.createCollection(collectionName, {}, 
					function(e,c){
						if(e){
							logger.trace(util.format('@getCollection#createCallback e is not null %s', e));
							if(callback)
								callback(e, null);
						}
						else{
							logger.trace(util.format('@getCollection#createCallback e not null and c type is: %s', typeof c));
							collectionMap[collectionName] = c;
							logger.info('...created collection: ' + collectionName);
							if(callback)
								callback(null, c);
						}
						logger.info(util.format('collection map has now %d elements', Object.keys(collectionMap).length));
					}
				);	
			}
			
		};

		if(collectionMap[collectionName]){
			logger.trace(util.format('@getCollection#createCallback found collection in map and its type is: %s', typeof (collectionMap[collectionName]) ) );
			callback(null,collectionMap[collectionName]);
		}
		else {
			logger.trace('...not in map, have to find connection...');
			getConnection(createCallback);
		}
			

	};

	/*
		callback(err, result: { ok: 1, obj: c)
	*/
	var findCollection = function(collectionName, callback){

		var getConnCallback = function(colN, cb){

			var colName = colN;
			var cback = cb;

			var f = function(err, conn){
				if(err){
					logger.trace(util.format('@findCollection#findCallback...err is not null: %s.', err));
					if(cback)
						cback(err, null);
				}
				else {
					conn.collection( colName, { "strict": false },  
						function(e, c){
							if(e){
								logger.trace(util.format('@findCollection#findCallback...e is not null: %s.', e));
								if(cback)
									cback(e, null);
							}
							else{
								logger.trace('@findCollection#findCallback...e is null.');
								if(cback){
									if(null !== c){
										logger.trace('@findCollection#findCallback...c is not null.');
										cback(null, { "ok": 1, "obj": c });
									}
									else{
										logger.trace('@findCollection#findCallback...c is null.');
										cback(null, { "ok": 0, "obj": null });
									}
								}
							}
						}
					);	
				}
			};

			return { f: f};

		}(collectionName, callback);

		getConnection(getConnCallback.f);

	};

	/*
		callback(err, result : { ok: 1|0})
	*/
	var delCollection = function(collectionName, callback){

		var findCallback = function(err, r){
			if(err){
				logger.trace(util.format('could not drop collection %s', collectionName));
				if(callback)
					callback(err, null);
			}
			else {
				if( 1 === r.ok ) {
					var coll = r.obj;
					coll.drop(function(err, r){
						if(err){
							logger.warn(util.format('could not drop collection %s', collectionName));
							if(callback)
								callback(err, null);
						}
						else {
							delete collectionMap[collectionName];
							logger.info(util.format('dropped collection %s', collectionName));
							callback(null, { "ok": 1 });			
						}
					});	
				}
				else {
					logger.warn(util.format('did not find collection %s', collectionName));
					callback(null, { "ok": 1 });
				}
					
			}
		};

		findCollection(collectionName, findCallback);

	};

	/*
		callback(err,connection)
	*/
	var getAll  = function(collectionName, callback) {

		logger.trace('@Model.getAll');

		var getAllCallback = function(cback){
			var cb = cback;
			var f = function(err, collection){
				if(err){
					logger.trace(util.format('@getAll#getAllCallback err is not null %s', err));
					if(cb)
						cb(err, null);
				}
				else {
					logger.trace(util.format('@getAll#getAllCallback err is null'));
					var cursor = collection.find();
					var result = [];
					cursor.each(function(e, item) {
						if (e) {
				  			if(cb)
								cb(e, null);
						}
						else{
							if (item != null) 
					    		result.push(item);
					    	else {
					    		if(cb)
					    			cb(null,result);	
					    	}
						}			 
				   	});
				}

			};

			return { f: f };

		}(callback);
			
		
		getCollection(collectionName, getAllCallback.f);

		logger.trace('Model.getAll@');
	};

	/*
		callback(err, result: { ok: 1, n: <num deleted> })
	*/
	var delAll = function(collectionName, callback) {

		logger.trace('@Model.delAll');
		
		var delCallback = function(err, collection){
			if(err) {
				logger.trace(util.format('@delCallback...err is not null: %s.', err));
				if(callback)
					callback(err, null);
			}
			else {
				collection.deleteMany({}, null, function(e, r){
					if(e){
						logger.trace(util.format('@delCallback#collection.deleteMany...e is not null: %s.', e));
						if(callback)
							callback(e, null);
					}	
					else {
						logger.trace(util.format('@delCallback#collection.deleteMany...e is null and we have r: %s.', JSON.stringify(r)));
						logger.trace(typeof r)
						callback(null, JSON.parse(r));
					}
					
				});
				
			}
		};

		if(collectionMap[collectionName]){
			delCallback(null,collectionMap[collectionName]);
		}
		else 
			getCollection(collectionName, delCallback);
		
		logger.trace('Model.delAll@');		
	};

	/*
		returns  id or err

	*/
	var post = function(collectionName, o, callback) {

		logger.trace('@Model.post');
		var id = null;

		var postCallback = function(err, o){
			if(err) {
				if(callback)
					callback(err);
			}
			else {
				if( o.ok == 1 ){
				  	logger.info(util.format('inserted %d elements in collection %s', o.n, collectionName));
			  		if(callback)
						callback(err, objId);
				}
			  	else {
			  		logger.info(util.format('result %d when inserting elements in collection %s', o.ok, collectionName));
			  		if(callback)
			  			callback(new Error('insert was not ok'));
			  	}
			}
		};

		if(! o._id ) {
			id = new ObjectID();
			o._id = id;
			collectionMap[collectionName].insertOne(o, postCallback );
		}
		else {			
			id = new ObjectID(o._id);
			o._id = id;
			collectionMap[collectionName].replaceOne(
				{'_id' : o._id}, o, postCallback );
		}

		logger.trace('Model.post@');
	};


	return { 
		getAll: getAll
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

	