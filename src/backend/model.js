//mongodb://username:password@hostname:port/database
var DB_CONNECT_STRING = 'mongodb://localhost:27017/vwparts';
var mongoose = require('mongoose');
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
  			callback.ok(items);
		});
		console.log('Model.getAll@');
	};

	return { 
		post: post,
		getAll: getAll
	}; 

}();

module.exports = Model;
