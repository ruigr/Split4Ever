
app.get('/api/image/:id', 
	function(req,res){
		console.log('@get/api/image');
		console.log('req param id is:' + util.inspect(req.params.id));
		var id = req.params.id;
		custom.log('id: ' + id);
		var callback = {
			ok:function(o){
				console.log('ok - got image with id: ' + id);
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
		model.getCollectionMember('images', id, callback);
	}
);

app.post('/api/image', 
	function(req,res){
		console.log('@post/api/image');

		var callback = {
			ok:function(id){
				console.log('post/api/image ok: ' + id);

				res.status(200).send({'result': id});
				res.end();
			},
			nok: function(err){
				console.error(err);	
				res.status(400);
				res.end();
			}
		};

		model.post2Collection('images', req.body, callback);
		
	}

);

app.post('/api/images', 
	function(req,res){
		console.log('@post/api/images');

		var callback = {
			ok:function(ids){
				console.log('post/api/images ok');
				res.status(200).send({'result': ids});
				res.end();
			},
			nok: function(err){
				console.error(err);	
				res.status(400);
				res.end();
			}
		};

		model.postMultiple2Collection('images', req.body, callback);
		
	}

);
