'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _es6Promise = require('es6-promise');

var exec = _child_process2['default'].execSync;

var Mdb = (function () {
	function Mdb() {
		var filePath = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
		var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, Mdb);

		if (_fs2['default'].existsSync(filePath)) {
			this.file = filePath;
		} else {
			throw 'File: ' + filePath + ' does not exist';
		}

		this.delimiter = options.delimiter || "|";
	}

	_createClass(Mdb, [{
		key: 'getTables',
		value: function getTables() {
			if (!this.tables) {
				this.tables = _exec('mdb-tables -1 ' + this.file).split('\n').filter(function (str) {
					return str;
				});
			}
			return this.tables;
		}
	}, {
		key: 'readCSV',
		value: function readCSV(table) {
			return _exec('mdb-export -D \'%F %T\' -d \'|\' ' + this.file + ' ' + table);
		}
	}, {
		key: 'parseCSV',
		value: function parseCSV(table) {
			var _this = this;

			return new _es6Promise.Promise(function (resolve, reject) {
				var csv = _this.readCSV(table);
				(0, _csvParse2['default'])(csv, {
					delimiter: _this.delimiter,
					columns: true
				}, function (err, data) {
					if (err) {
						reject(err);
					}
					resolve(data);
				});
			});
		}

		// Alias for parseCSV
	}, {
		key: 'getTable',
		value: function getTable(table) {
			return this.parseCSV(table);
		}
	}]);

	return Mdb;
})();

function _exec(command) {
	return exec(command, { encoding: 'utf8' });
}

exports['default'] = Mdb;
module.exports = exports['default'];
