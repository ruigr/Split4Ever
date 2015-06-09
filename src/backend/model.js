//mongodb://username:password@hostname:port/database
var custom = require('./custom.js');
var mongoose = require('mongoose');

//var DB_CONNECT_STRING = 'mongodb://app:password@172.28.245.101:27017/vwparts';
var DB_CONNECT_STRING = process.env.DB_CONN_STR;

if(custom.areWeOnBluemix() && custom.doWeHaveServices())
	DB_CONNECT_STRING = custom.getMongoConnectString();

mongoose.connect(DB_CONNECT_STRING);

var Model = function() {

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
	  console.log('db open');
	});

	var User = mongoose.model('User', 
		new mongoose.Schema({
			username: String,
			password: String
			}
		)
	);

	var Item = mongoose.model('Item', 
		new mongoose.Schema({
				id: String,
				name: String,
				notes: String,
				price: Number,
				images: Array
			}
		)
	);	

	var post = function(o, callback) {
		console.log('@Model.post');
		if(!o.id){
			console.log('item has no id, going to create one');
			o.id = new mongoose.Types.ObjectId;
			console.log('created id: ' + o.id ) ;
		}
		var item=new Item(o);
		item.save(function(err, item) {
  			if (err) {
  				console.error(err);
  				callback.nok(null);
  			}
  			else
  				callback.ok(item);
		});
		console.log('Model.post@');
	};	

	var getAll  = function(callback) {
		console.log('@Model.getAll');
		Item.find(function (err, items) {
  			if (err) {
  				console.error(err);
  				callback.nok(null);
  			}
  			else
  				callback.ok(items);
		});
		console.log('Model.getAll@');
	};

	var get  = function(idVal, callback) {
		console.log('@Model.get');

		var searchItem = { id: idVal};
		Item.findOne(searchItem, 'id name images price notes', function (err, item) {
  			if (err) {
  				console.error(err);
  				callback.nok(idVal);
  			}
  			else
  				callback.ok(item);
		});
		console.log('Model.get@');
	};

	return { 
		post: post,
		getAll: getAll,
		get: get
	}; 

}();

module.exports = Model;
