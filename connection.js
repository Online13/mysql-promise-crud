const config = require('{root_path}/config.json');
const mysql = require('mysql');

module.exports = (database,host=null,user=null,password=null) => {
	const connection = mysql.createConnection({
		host: host || config.mysql.host,
		user: user || config.mysql.user,
		password: password || config.mysql.password,
		database: database
	});

	connection.connect();

	return connection;
}