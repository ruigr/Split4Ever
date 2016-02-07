
var expect = require('chai').expect;
var assert = require('chai').assert;
var util = require('util');
var model = require('../dist/backend/model.js');
var custom = require('../dist/backend/custom.js');
var logger = custom.createLogger('tests');



describe('model test - items', function() {



	 before(function(done) {
	    // runs before all tests in this block
	    var callback = function(){
			var ok = function(){
				done();	
			};
			var nok = function(){
				throw 'cannot connect to db';	
				done();
			};
			return { ok: ok, nok: nok };
		}();
	    model.init(['items_test'], callback);
	 });

	after(function(done) {
    	 var callback = function(){
			var ok = function(){
				done();	
			};
			var nok = function(){
				throw 'cannot drop collection';	
				done();
			};
			return { ok: ok, nok: nok };
		}();
		logger.info(util.format('dropping collection %s', 'items_test'));
	    model.delCollection('items_test', callback);
  	});

/*	 beforeEach(function(done) {
    	// runs before each test in this block
    	var callback = function(){
			var ok = function(o){
				done();	
			};
			var nok = function(err){
				console.log(err);	
				done();
			};
			return { ok: ok, nok: nok };
		}();
		model.delAll('items_test', callback);
  	});*/

	describe('#getAll()', function(){
	    it('should return an array of 0 elements for collection is empty', function(done){
	    	var callback = function(){
				var ok = function(o){
					assert.typeOf(o, 'array');
					assert.lengthOf(o,0);
					done();	
				};
				var nok = function(err){
					console.log(err);	
					done();
				};
				return { ok: ok, nok: nok };
			}();

			model.getAll('items_test', callback);
		});
	});

	describe('#post()', function(){

		var item = custom.createDummyItem(true);

	    it('should return a new Id when we are inserting in an empty collection', function(done){
	    	var callback = function(){
				var ok = function(o){
					logger.info(util.format('ok: ', JSON.stringify(o)));
					expect(null != o);
					item._id = o;
					done();	
				};
				var nok = function(err){
					console.log(err);	
					done();
				};
				return { ok: ok, nok: nok };
			}();
			model.post('items_test', item, callback);
		});

		it('should return the same Id when we are inserting the same object', function(done){
		
	    	var callback = function(){
				var ok = function(o){
					logger.info(util.format('ok: ', JSON.stringify(o)));
					assert.equal(item._id, o);
					done();	
				};
				var nok = function(err){
					console.log(err);	
					done();
				};
				return { ok: ok, nok: nok };
			}();
			
			model.post('items_test', item, callback);


		});

		 it('should return an array of 1 element after one insert and one update', function(done){
	    	var callback = function(){
				var ok = function(o){
					logger.info(util.format('ok: ', JSON.stringify(o)));
					assert.typeOf(o, 'array');
					assert.lengthOf(o,1);
					done();	
				};
				var nok = function(err){
					console.log(err);	
					done();
				};
				return { ok: ok, nok: nok };
			}();
			model.getAll('items_test', callback);
		});
	});



	//get by id

		

	//delete

});

