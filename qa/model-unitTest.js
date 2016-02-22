
var expect = require('chai').expect;
var assert = require('chai').assert;
var util = require('util');
var model = require('../dist/backend/model.js');
var custom = require('../dist/backend/custom.js');
var logger = custom.createLogger('tests');



describe('model test - items', function() {

	var TEST_COLLECTION = 'itemstest';

	var cleanup = function(doneFunc){
		var doneF = doneFunc;
		var f = function(err,o){
			if(err){
    	 		logger.error(util.format('...could not drop test collection: %s', err));
    	 		logger.info('-----------------------------------------');	
				doneF();
    	 	}
    	 	else{
    	 		logger.info(util.format('...dropped collection %s.', TEST_COLLECTION));
    	 		logger.info('-----------------------------------------');
				doneF();
    	 	}
		};
		return {f: f};
	};

	before(function(done) {
	    // runs before all tests in this block
	    logger.info('-------------- before tests --------------');
	    var callback = cleanup(done);
	    model.delCollection(TEST_COLLECTION, callback.f);
	});

	after(function(done) {
		logger.info('-------------- after tests ---------------');
		// runs after all tests in this block
    	 var callback = cleanup(done);
	    model.delCollection(TEST_COLLECTION, callback.f);
  	});

	describe('#getAll()', function(){
	    it('should return an array of 0 elements for collection is empty', 
	    	function(done){
		    	var callback = function(err, o){
		    		if(err){
		    			logger.error(err);	
						done();
		    		}
		    		else {
						assert.typeOf(o, 'array');
						assert.lengthOf(o,0);
						done();
		    		}
				};
			model.getAll(TEST_COLLECTION, callback);
		});
	});

	describe('#post()', function(){

		var item = custom.createDummyItem(true);
	    it('should return a new Id when we are inserting in an empty collection', function(done){
	    	var callback = function(err, objId){
	    		if(err){
	    			console.log(err);	
					done();
	    		}
	    		else {
	    			logger.info(util.format('ok: ', JSON.stringify(objId)));
					expect(null != objId);
					item._id = objId;
					done();
	    		}
			};
			model.post(TEST_COLLECTION, item, callback);
		});

		it('should return the same Id when we are inserting the same object', function(done){
	    	var callback = function(err, objId){
	    		if(err){
	    			console.log(err);	
					done();
	    		}
	    		else {
	    			logger.info(util.format('ok: ', JSON.stringify(objId)));
					assert.equal(item._id, objId);
					done();
	    		}
			};
			model.post(TEST_COLLECTION, item, callback);

		});

		 it('should return an array of 1 element after one insert and one update', function(done){
	    	var callback = function(err, arr){
	    		if(err) {
	    			logger.error(err);	
					done();
	    		}
	    		else {
	    			logger.info(util.format('ok: ', JSON.stringify(arr)));
					assert.typeOf(arr, 'array');
					assert.lengthOf(arr,1);
					done();
	    		}
			};
			model.getAll(TEST_COLLECTION, callback);
		});
	});



	//get by id

		

	//delete

});

