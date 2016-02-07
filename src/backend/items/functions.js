var PragmaLogger = require('pragma-logger');
var util = require('util');
var logger = new PragmaLogger({
    logger: {
      charset: 'utf8',
      levels: {
        debug: './logs/%pid_debug_%y-%m-%d-items_functions.log',
        error: './logs/%pid_error_%y-%m-%d-items_functions.log',
        warn: './logs/%pid_warn_%y-%m-%d-items_functions.log',
        trace: './logs/%pid_trace_%y-%m-%d-items_functions.log',
        info: './logs/%pid_info_%y-%m-%d-items_functions.log'
      },
      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
    }
  }, 'items_functions');

var model = require('../model.js');



var ItemsFunctions = function(){

  var collectionName = 'items';

  var getAll = function(req,res){
    logger.trace('<IN>getAll');
    var id = null;
    var callback = {
      ok:function(o){
        //logger.log('ok - got item with id: ' + id);
        res.status(200).json(o);
        res.end();
      },
      nok: function(err){
        logger.error(err);
        res.status(400).end();
      }
    };
    model.getAll(collectionName, callback);
    logger.trace('<OUT>getAll');
  };

  return {
    getAll: getAll
  };

}();

//or all


module.exports = ItemsFunctions;

/*
var getById = function(req,res){
  logger.trace('<IN>getItemById');
  logger.debug('req parameter id is: ' + req.params.id);
  var id = req.params.id;
  var callback = {
    ok:function(o){
      logger.log('ok - got item with id: ' + id);
      res.status(200).json(o);
      res.end();
    },
    nok: function(err){
      logger.error(err);
      res.status(400).end();
    }
  };
  model.get(id, callback);
  logger.trace('<OUT>getItemById');
}

var csvchain = [ raw2timeseries.execute, timeseriesdbsink.execute, consolesink.execute ];
router.post('/io/csv', csvchain);
logger.info('loaded analytics');



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

        res.status(200).send({'result': id});
        res.end();
      },
      nok: function(err){
        console.error(err); 
        res.status(400);
        res.end();
      }
    };
    //console.log(req.body);
    model.post(req.body, callback);
    
  }
);


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

app.delete('/api/item/:id', 
  function(req,res){
    console.log('@delete/api/item');
    var id = req.params.id;
    custom.log('id: ' + id);
    var callback = {
      ok:function(o){
        console.log('ok - deleted item with id: ' + id);
        res.status(200).send({'result': id});
        res.end();
      },
      nok: function(err){
        console.error(err); 
        res.status(400);
        res.end();
      }
    };
    model.del(id, callback);
  }
);*/

