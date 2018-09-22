import fs from 'fs';
import childProcess from 'child_process';
import csvParse from 'csv-parse';
import {Promise} from 'es6-promise';

const exec = childProcess.execSync;

class Mdb {
	constructor(filePath=null, options={}) {
		if (fs.existsSync(filePath)) {
			this.file = filePath;
		} else {
			throw `File: ${filePath} does not exist`;
		}

		this.delimiter = options.delimiter || "|";
	}

	getTables() {
		if(!this.tables) {
			this.tables = _exec(`mdb-tables -1 ${this.file}`)
				.split('\n')
				.filter(str => str);
		}
		return this.tables;
	}

	readCSV(table) {
		return _exec(`mdb-export '%F %T' -d '|' ${this.file} ${table}`);
	}

	parseCSV(table) {
		return new Promise((resolve, reject) => {
			const csv = this.readCSV(table);
			csvParse(csv, {
				delimiter: this.delimiter,
				columns: true
			}, (err, data) => {
				if (err) { reject(err); }
				resolve(data);
			});
		});
	}

	// Alias for parseCSV
	getTable(table) {
		return this.parseCSV(table);
	}

}

function _exec(command) {
	return exec(command, { encoding: 'utf8' });
}


export default Mdb;
