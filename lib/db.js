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
	constructor(config,database,table=null) {
		// connection to database
		this.db = require('./connection')(config,database);
		// useful for handle error
		this.schema = new Map();
		if (table !== null)
			this.set('table',table);
		else
			this.table = null;
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
		let str = deb, i, keys = Object.keys(spec),key;
		const len = keys.length
		for (i = 0;i < len;i++)
		{
			key = keys[i];
			if (!this.schema.get(this.table).has(key))
				throw new Error(`syntax error: ${key} unknown`)
			str += `${key}= ?`;
			if (i !== len-1) {
				str += 'AND ';
			}
		}
		return str;
	}
	/*
	 * for changing the current table, and the schema
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
					this.set('schema').then(resolve).catch(reject)
					break;
				case "schema":
					if (!this.schema.has(this.table)) {
						this.schema.set(this.table,new Map())
						this.db.query(`DESCRIBE ${this.table}`,(err,result) => {
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
			let sql = `INSERT INTO ${this.table} VALUES (${MySQL.escape(n)})`;
			this.db.query(sql,data,(err,result) => {
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
			let sql = `SELECT * FROM ${this.table} `;
			let option = (spec) ? Object.values(spec) : null;
			if (spec !== null) {
				sql += this.parse("WHERE ",spec);
			}
			this.db.query(sql,option,(err,row) => {
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

			let sql = `UPDATE ${this.table} ${this.parse("SET ",up)} `;
			let option = Object.values(up)
			if (spec !== null) {
				sql += this.parse("WHERE ",spec)
				option = [...value,...(Object.values(spec))]
			}

			this.db.query(sql,option,(err,result) => {
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

			let sql = `DELETE FROM ${this.table}`;
			let option =(spec) ? Object.values(spec) : null;
			if (spec !== null) {
				sql += ` ${this.parse("WHERE ",spec)}`;
			}
			this.db.query(sql,option,(err,result) => {
				if (err) reject(err)
				resolve(result);
			})
		})
	}
}

module.exports = MySQL;