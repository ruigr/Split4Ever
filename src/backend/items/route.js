var express = require('express');
var PragmaLogger = require('pragma-logger');
var util = require('util');
var logger = new PragmaLogger({
    logger: {
      charset: 'utf8',
      levels: {
        debug: './logs/%pid_debug_%y-%m-%d-items_route.log',
        error: './logs/%pid_error_%y-%m-%d-items_route.log',
        warn: './logs/%pid_warn_%y-%m-%d-items_route.log',
        trace: './logs/%pid_trace_%y-%m-%d-items_route.log',
        info: './logs/%pid_info_%y-%m-%d-items_route.log'
      },
      messageFormat: '%t \t| %name :: %lvl \t| PID: %pid - %msg'
    }
  }, 'items_route');

var functions = require('./functions');
logger.trace('started loading...');
var router = express.Router();

router.get('/all', functions.getAll);
//router.get('/:id', functions.getById);
//router.post('/', functions.post);
//router.delete('/:id', functions.delete);


logger.trace('...finished loading.');
module.exports = router;
