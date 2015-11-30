//mongodb://username:password@hostname:port/database
var custom = require('./custom.js');
var mongolib = require('mongodb');
var ObjectID = mongolib.ObjectID
var mongoClient = mongolib.MongoClient;
var util = require('util');
var assert = require('assert');

var DB_CONNECT_STRING = 'mongodb://app:password@localhost:27017/vwparts';

if(process.env.DB_CONN_STR)
	DB_CONNECT_STRING = process.env.DB_CONN_STR;

if(custom.areWeOnBluemix() && custom.doWeHaveServices()){
	DB_CONNECT_STRING = custom.getMongoConnectString();
	if(custom.areWeOnDocker()){
		custom.log('waiting for bluemix network to pop up...');
		custom.sleep(120000);
		custom.log('...resuming now');	
	}
}

console.log('going to connect to db in: ' + DB_CONNECT_STRING);

var Model = (function(){


	var dbcnx = (function(){
		custom.log('@dbcnx');
		var connection = null;

		var callback = function(err, db){
			assert.equal(null, err);
			console.log('connected to db !;-)');
			setConnection(db);
		};

		var setConnection = function(o){
			connection = o;
			init();
			//console.log('new db connection: ' + util.inspect(connection));
		};

		var get = function() {
			return connection;
		};

		var init = function(){

			console.log('going to init collections');
			var collections = ['items', 'categories', 'subCategories', 'images'];
			for(var i=0; i < collections.length; i++){
				var col = collections[i];
				if(null == connection.collection(col))
					connection.createCollection(col);

				console.log('there is collection: ' + col);
			}

		};

		return {
			get : get,
			callback: callback
		};
		custom.log('dbcnx@');
	}());

		
	mongoClient.connect(DB_CONNECT_STRING, dbcnx.callback);


	var post = function(o, callback) {
		custom.log('@Model.post');
		var id = null;

		var cbObj = function(cb, objId){
			var _callback = cb;
			var _id = objId;

			var f = function(err,result){
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
				f:f
			};

		};

		if(! o._id ) {
			id = new ObjectID();
			o._id = id;
			var c = cbObj(callback, id);
			dbcnx.get().collection('items').insertOne(o, c.f );
		}
		else {			
			id = new ObjectID(o._id);
			o._id = id;
			var c = cbObj(callback, id);
			dbcnx.get().collection('items').replaceOne(
				{'_id' : o._id}, o, c.f );
		}

		
	};

	var getAll  = function(callback) {

		console.log('@Model.getAll');
		var cursor = dbcnx.get().collection('items').find();
		var result = [];

		cursor.each(function(err, item) {
			//console.log('cursor getting an item: ' + util.inspect(item));
			if (err) {
	  			console.error(err);
	  		}

	    	if (item != null) 
	    		result.push(item);
	    	else
	    		callback.ok(result);

	   	});
		

		console.log('Model.getAll@');
	};

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
	};

	return { 
		post: post
		,getAll: getAll
		,getCollection: getCollection
		,post2Collection: post2Collection
		,get: get
		,del: del
	}; 

}());

module.exports = Model;

