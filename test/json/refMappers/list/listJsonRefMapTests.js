var S = require('string');
var assert = require("assert");
var should = require('should');
var jsonHelper = require('../../../../modules/json/jsonService');

var config = {};
config.refMapper = require('../../../../modules/json/refMappers/json/refsAsList');
config.deepclone = true;

describe('json service', function () {
	describe('refmaps', function () {
		describe('list json', function () {

			it('json list - multiple states', function (done) {

				config.external = {
					"/child": {
						"title": "state1"
					},
					"/child_new-state": {
						"title": "state2"
					}
				}

				var data = {
					"child1": {
						"$ref": "/child"
					},
					"child2": {
						"$ref": "/child_new-state"
					},
				}

				var results = jsonHelper.resolveComponentJson(data, config).refMap;

				var expected = {
					"items": [
						{
							"name": "/child",
							"state": {
								"title": "state1"
							}
						},
						{
							"name": "/child_new-state",
							"state": {
								"title": "state2"
							}
						}
					]
				}

				assert.deepEqual(expected, results);

				done();

			})

			it('json list - add used types only', function (done) {

				config.external = {
					"/child": {
						"title": "state1"
					},
					"/child_new-state": {
						"title": "state2"
					}
				}

				var data = {
					"child1": {
						"$ref": "/child"
					}
				}

				var results = jsonHelper.resolveComponentJson(data, config).refMap;

				var expected = {
					"items": [
						{
							"name": "/child",
							"state": {
								"title": "state1"
							}
						}
					]
				}

				assert.deepEqual(expected, results);

				done();

			})

			it('json list - multiple types', function (done) {

				config.external = {
					"/child": {
						"title": "type",
					},
					"/child2": {
						"title": "type2"
					}
				}

				var data = {
					"child1": {
						"$ref": "/child"
					},
					"child2": {
						"$ref": "/child2"
					}
				}

				var results = jsonHelper.resolveComponentJson(data, config).refMap;

				var expected = {
					"items": [
						{
							"name": "/child",
							"state": {
								"title": "type"
							}
						},
						{
							"name": "/child2",
							"state": {
								"title": "type2"
							}
						}
					]
				}

				assert.deepEqual(expected, results);

				done();

			})

			it('json list - sub block', function (done) {

				config.external = {
					"/sub": {
						"title": "type"
					},
					"/child": {
						"vm": { "$ref": "/sub" }
					}
				}

				var data = {
					"child1": { "$ref": "/child" }
				}

				var results = jsonHelper.resolveComponentJson(data, config).refMap;
				var debug = JSON.stringify(results, null, 4);

				var expected = {
					"items": [
						{
							"name": "/child",
							"state": {
								"vm": { "$ref": "/sub" }
							}
						},
						{
							"name": "/sub",
							"state": {
								"title": "type"
							}
						}
					]
				}

				assert.deepEqual(expected, results);

				done();

			})

			it('json list - sub sub object', function (done) {

				config.external = {
					"/child": {},
					"/child_new-state": {}
				}

				var data = {
					"child": {
						"grandchild": {
							"child1": { "$ref": "/child" },
							"child2": { "$ref": "/child_new-state" }
						}
					}
				}

				var results = jsonHelper.resolveComponentJson(data, config).refMap;

				var expected = {
					"items": [
						{
							"name": "/child",
							"state": {	}
						},
						{
							"name": "/child_new-state",
							"state": {	}
						}
					]
				}

				assert.deepEqual(expected, results);

				done();

			})

			it('json list - array', function (done) {

				config.external = {
					"/child": {},
					"/child_new-state": {}
				}

				var data = {
					"child": [
						{ "$ref": "/child" },
						{ "$ref": "/child_new-state" }
					]
				}

				var results = jsonHelper.resolveComponentJson(data, config).refMap;

				var expected = {
					"items": [
						{
							"name": "/child",
							"state": {	}
						},
						{
							"name": "/child_new-state",
							"state": {	}
						}
					]
				}

				assert.deepEqual(expected, results);

				done();

			});

			it('json list - array item with sub block', function (done) {

				config.external = {
					"/sub": {
						"title": "type"
					},
					"/child": {
						"vm": { "$ref": "/sub" }
					},
					"/child_new-state": {
						"vm": { "$ref": "/sub" }
					}
				}

				var data = {
					"child1": [
						{ "$ref": "/child" },
						{ "$ref": "/child_new-state" }
					]
				}

				var results = jsonHelper.resolveComponentJson(data, config).refMap;

				var expected = {
					"items": [
						{
							"name": "/child",
							"state": {	
								"vm": { "$ref": "/sub" }
							}
						},
						{
							"name": "/sub",
							"state": {
								"title": "type"
							}
						},
						{
							"name": "/child_new-state",
							"state": {	
								"vm": { "$ref": "/sub" }
							}
						}
					]
				}

				assert.deepEqual(expected, results);

				done();

			})

			it('json list - array item with sub block as object', function (done) {

				config.external = {
					"/child": {},
					"/child_new-state": {}
				}

				var data = {
					"child": [
						{
							"vm": { "$ref": "/child" }
						},
						{
							"vm": { "$ref": "/child_new-state" }
						},
					]
				}

				var results = jsonHelper.resolveComponentJson(data, config).refMap;
				var debug = JSON.stringify(results, null, 4);

				var expected = {
					"items": [
						{
							"name": "/child",
							"state": {	}
						},
						{
							"name": "/child_new-state",
							"state": {	}
						}
					]
				}

				assert.deepEqual(expected, results);

				done();

			})

		});
	});
});