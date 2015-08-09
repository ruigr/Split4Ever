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
	custom.log('waiting for bluemix network to pop up...');
	custom.sleep(120000);
	custom.log('...resuming now');
}


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
			//console.log('new db connection: ' + util.inspect(connection));
		};

		var get = function() {
			return connection;
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
		if(! o._id ) {
			o._id = new ObjectID();
			dbcnx.get().collection('items').insertOne(o,
				function(err,result){
					if (err) {
		  				console.error(err);
		  				callback.nok(err);
		  			}
		  			else {
		  				console.log('item save successful with id: ' + result.insertedId );
		  				// + util.inspect(result));
		  				callback.ok(result.insertedId);
		  			}
				}
			);
		}
		else {
			o._id = new ObjectID(o._id);
			dbcnx.get().collection('items').replaceOne(
				{'_id' : o._id},
				o,
				function(err,result){
					if (err) {
		  				console.error(err);
		  				callback.nok(null);
		  			}
		  			else {
		  				console.log('item save successful');
		  				callback.ok(result);
		  			}
				}
			);

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
	  				console.log('item del successful');
	  				callback.ok(result);
	  			}
			}
		);
		console.log('Model.del@');		
	};

	return { 
		post: post,
		getAll: getAll
		,get: get
		,del: del
	}; 

}());

module.exports = Model;
