app.get('/api/categories', 
	function(req,res){
		
		console.log('@get/api/categories');
		var callback = {
			ok:function(o){
				console.log('ok - got ' + o.length + ' categories');
				res.status(200).send(o);
				res.end();
			},
			nok: function(o){
				console.error(err);
				res.status(400);
				res.end();
			}
		};
		model.getCollection('categories', callback);
		console.log('get/api/categories@');
	}
);


app.post('/api/categories', 
	function(req,res){
		console.log('@post/api/categories');

		var callback = {
			ok:function(id){
				console.log('post/api/categories ok: ' + id);

				res.status(200).send({'result': id});
				res.end();
			},
			nok: function(err){
				console.error(err);	
				res.status(400);
				res.end();
			}
		};

		model.post2Collection('categories', req.body, callback);
		
	}
);