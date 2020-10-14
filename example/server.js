const http = require('http');
const MySQL = require('mysql-promise-crud'); // ./index
const config = {
	user: "root",
	host: "localhost",
	password: "***"
};
//const db = new MySQL(config,'database name');
const db = new MySQL(config,'portfolio','projects');

const server = http.createServer(async (req,res)=> {
	const data = await db.read();
	res.end(JSON.stringify(data));
}).listen(8080);