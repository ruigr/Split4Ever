var custom = require('./custom.js');
var util = require('util');
var express = require('express');
var model = require('./model.js');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); 


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true, limit: '10240kb' })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

var options = {
  dotfiles: 'ignore',
  etag: false,
   extensions: ['png', 'html'],
  //index: false,
  redirect: false
};

var PORT=3000;
if(process.env.PORT)
	PORT=process.env.PORT;

if(custom.areWeOnDocker())
	app.use(express.static('ui', options));
else
	app.use(express.static('dist/ui', options));



app.get('/api/items', 
	function(req,res){
		
		console.log('@get/api/items');
		var callback = {
			ok:function(o){
				console.log('ok - got ' + o.length + ' items');
				res.status(200).send(o);
				res.end();
			},
			nok: function(o){
				console.error(err);
				res.status(400);
				res.end();
			}
		};
		model.getAll(callback);
		console.log('get/api/items@');
	}
);

app.get('/api/item/:id', 
	function(req,res){
		console.log('@get/api/item');
		console.log('req param id is:' + util.inspect(req.params.id));
		var id = req.params.id;
		custom.log('id: ' + id);
		var callback = {
			ok:function(o){
				console.log('ok - got item with id: ' + id);
				//console.log('ok: ' + util.inspect(o));
				//res.writeHead(200, {'Content-Type': 'text/plain'});
				res.status(200).send(o);
				res.end();
			},
			nok: function(o){
				console.error(err);
				res.status(400);
				res.end();
			}
		};
		//console.log(req.body);
		model.get(id, callback);
	}
);



app.post('/api/item', 
	function(req,res){
		console.log('@post/api/item');

		var callback = {
			ok:function(id){
				console.log('post/api/item ok: ' + id);

				res.status(200).send({result: id});
				res.end();
			},
			nok: function(err){
				console.error(err);	
				res.status(400);
				res.end();
			}
		};
		//console.log(req.body);
		model.post(req.body, callback)
		
	}
);

app.put('/api/item', 
	function(req,res){

	}
);

app.delete('/api/item/:id', 
	function(req,res){
		console.log('@delete/api/item');
		var id = req.params.id;
		custom.log('id: ' + id);
		var callback = {
			ok:function(o){
				console.log('ok - deleted item with id: ' + id);
				res.status(200).send({result: id});
				res.end();
			},
			nok: function(err){
				console.error(err);	
				res.status(400);
				res.end();
			}
		};
		model.del(id, callback)
	}
);



var server = app.listen(PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

