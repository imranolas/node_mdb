/* global describe it expect jasmine */

require('babel/register');
var Mdb = require('../index.js');
var path = require('path');
var fs = require('fs');

var file = path.join(__dirname, './fixtures/file.mdb');

describe("Mdb", function() {

	it('should throw an error if no path is given', function() {
		expect(function() {new Mdb()}).toThrow("File: null does not exist");
	});

	it('should accept a valid path', function() {
		expect(new Mdb(file))
			.toEqual(jasmine.objectContaining({
				file: file
			}));
	});

	describe('#getTables', function() {
		it('should return an array of tables names', function() {
			var db = new Mdb(file);
			expect(db.getTables()).toEqual(['TblErrorExamples', 'TblErrorLog']);
		});
	});


	describe('#readCSV', function() {
		it('should return CSV string for a given table', function() {
			var csv = fs.readFileSync(path.join(__dirname, './fixtures/csv.txt'), 'utf-8');
			var db = new Mdb(file);
			expect(db.readCSV('TblErrorExamples')).toContain(csv);
		});
	});

	describe('#parseCSV', function() {
		it('should return an object given a CSV string', function(done) {
			var result = require('./fixtures/record.js');
			var db = new Mdb(file);
			db.parseCSV('TblErrorExamples')
				.then(function(data) {
					expect(data[0]).toEqual(result);
					done();
				});
		});
	});

});
