var PORT=3000;

var util = require('util');
var express = require('express');
var model = require('./model.js');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); 


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.use(express.static('dist/ui'));

app.get('/api/item/all', 
	function(req,res){
		
		console.log('@get/api/item/all');
		var callback = {
			ok:function(o){
				console.log('ok: ' + util.inspect(o));
				//res.setHeader('Content-Type', 'application/json');
				//res.writeHead(200);
				res.status(200).send(o);
				res.end();
			},
			nok: function(o){
				console.log('nok');	
				res.status(400);
				res.end();
			}
		};
		model.getAll(callback);
	}
);

app.get('/api/item/:id', 
	function(req,res){
		var id = request.params.id;
	}
);



app.post('/api/item', 
	function(req,res){
		console.log('@post/api/item');

		var callback = {
			ok:function(o){
				console.log('ok:' + util.inspect(o));
				res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end();
			},
			nok: function(o){
				console.log('nok');	
			}
		};
		console.log(req.body);
		model.post(req.body, callback)
		
	}
);

app.put('/api/item', 
	function(req,res){

	}
);

app.delete('/api/item', 
	function(req,res){

	}
);


var server = app.listen(PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

