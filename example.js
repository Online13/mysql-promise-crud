const db = require('{controllers_path}/database');

// example: todo middleware

module.exports = (req,res,next) => {
	req.todo = {};
	req.todo.get = async () => {
		await db.set('table','todo');
		const Do = await db.read();
		return Do;
	}
	req.todo.set = async (thing) => {
		await db.set('table','todo');
		const result = await db.create(thing) // depend of structure of table
		return result;
	}
	req.todo.delete = async (id=null) => {
		await db.set('table','todo');
		let obj = null
		if (id !== null) obj = { id }
		const result = await db.delete(obj);
		return result;
	}
	next();
}