const mysql = require('mysql');

module.exports = (config,database) => {
	const connection = mysql.createConnection({
		host: config.host,
		user: config.user,
		password: config.password,
		database: database
	});

	connection.connect();

	return connection;
}