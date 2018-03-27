var request = require("request"),
  assert = require('assert'),
  todo = require('../server/app.js'),
  base_url = "http://localhost:8000/";

describe("Todo application test", function(){
	describe("GET /", function() {
		it("returns status code 200", function(done) {
			request.get(base_url, function(error, response, body) {
				assert.equal(200, response.statusCode);
				done();
     	 	});
		});
	});
	describe("Section id matches app name", function() {
	it("returns a section with id equal to todoapp", function(done) {
		request.get(base_url, function(error, response, body) {
			assert.equal('todoapp', response.section.id);
			done();
		});
	});
});
});