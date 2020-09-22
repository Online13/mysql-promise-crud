/*
 * Handler database (mysql)
 * @class
 */
class MySQL
{
	/*
	 * constructor
	 * @param {string} name of the database
	 * @param {string} name of the table if exists
	 */
	constructor(database,table=null) {
		this.db = require('./connection')(database);
		this.table = table;
		this.schema = new Map();
	}

	/*
	 * for displaying something like that : ?, ?, ..., ?
	 * @param {integer}
	 * @return {string} 
	 */
	static escape(n) {
		return (new Array(n)).fill('?').join(', ')
	}
	/*
	 * return something like that : key= ? key = ?,...
	 * @param {string} especially WHERE or SET
	 * @param {object} 
	 * @return {string}
	 */
	parse(deb,spec) {
		if (typeof(deb) !== 'string' || !(spec instanceof Object))
			throw new Error('TypeError here')
		let str = deb;
		const len = Object.keys(spec).length
		Object.keys(spec).forEach((key,index) => {
			if (!this.schema.get(this.table).has(key))
				throw new Error('syntax error: ' + key + ' unknown')
			str += `${key}= ?`;
			if (index !== len-1) {
				str += 'AND ';
			}
		})
		return str;
	}
	/*
	 * for changing the current table
	 * @param {string} name of the new table
	 */
	set(name,value=null) {
		return new Promise((resolve,reject) => {
			switch (name) {
				case "table":
					if (typeof(value) !== 'string')
						throw new Error('TypeError here')
					if (value === null)
						throw new Error('none table')
					this.table = value; 
					this.set('schema')
						.then(resolve)
						.catch(reject)
					break;
				case "schema":
					if (!this.schema.has(this.table)) {
						this.schema.set(this.table,new Map())
						this.db.query('DESCRIBE ' + this.table,(err,result) => {
							if (err) reject(err)
							result
								.map( (col) => col.Field )
								.forEach((item) => { this.schema.get(this.table).set(item,null); })
							resolve()
						})
					} else {
						resolve()
					}
					break;
				default:
					console.log(name,value);
			}
		})
	}
	/*
	 * create a row in the table
	 * @param {array} new value in the table
	 * @return {object} Promise
	 */
	create(data){
		if (!(data instanceof Array))
			throw new Error('TypeError here')
		return new Promise((resolve,reject) => {
			if (this.table === null)
				reject('you forgot to use table');

			const n = data.length;
			this.db.query('INSERT INTO ' + this.table +' VALUES ( ' + MySQL.escape(n) + ')',data,(err,result) => {
				if (err) reject(err)
				resolve(result);
			});
		})
	}
	/*
	 * get input in the table
	 * @return {object} Promise
	 */
	read(spec=null) {
		return new Promise((resolve,reject) => {
			if (this.table === null)
				reject('you forgot to use table');
			let request = 'SELECT * FROM ' + this.table + ' ';
			if (spec !== null) {
				request += this.parse("WHERE ",spec);
			}
			this.db.query(request,spec === null ? null : Object.values(spec),(err,row) => {
				if (err) reject(err)
				resolve(row);
			})
		})
	}
	/*
	 * update all input or all input that verify spec
	 * @param {object} new value
	 * @param {object} filter
	 * @return {object} Promise
	 */
	update(up,spec=null) {
		return new Promise((resolve,reject) => {
			if (this.table === null)
				reject('you forgot to use table');

			let request = 'UPDATE ' + this.table + ' '+ this.parse("SET ",up) + ' ';
			let value = Object.values(up)
			if (spec !== null) {
				request += this.parse("WHERE ",spec)
				value = [...value,...(Object.values(spec))]
			}

			this.db.query(request,value,(err,result) => {
				if (err) reject(err)
				resolve(result);
			})
		})
	}
	/*
	 * delete all input or all input that verify spec
	 * @param {object} filter
	 * @return {object} Promise
	 */
	delete(spec=null) {
		return new Promise((resolve,reject) => {
			if (this.table === null)
				reject('you forgot to use table');

			let request = 'DELETE FROM ' + this.table;
			if (spec !== null) {
				request += ' ' + this.parse("WHERE ",spec);
			}
			this.db.query(request,(spec) ? Object.values(spec) : null ,(err,result) => {
				if (err) reject(err)
				resolve(result);
			})
		})
	}
}

module.exports = MySQL;