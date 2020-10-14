// using express to manage routes and middlewares

const MySQL = require('mysql-promise-crud'); // ./lib/index
const config = {
	user: "root",
	host: "localhost",
	password: "****"
};
//const db = new MySQL(config,'database name');
const db = new MySQL(config,'database name','todo');

module.exports = (req,res,next) => {
	req.todo = {};
	req.todo.get = async () => {
		//await db.set('table','todo');
		const Do = await db.read();
		return Do;
	}
	req.todo.set = async (thing) => {
		//await db.set('table','todo');
		// depend of structure of table
		const result = await db.create(thing)
		return result;
	}
	req.todo.delete = async (id=null) => {
		//await db.set('table','todo');
		let obj = null;
		if (id !== null) 
			obj = { id };
		const result = await db.delete(obj);
		return result;
	}
	next();
}