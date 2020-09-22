const MySQL = require('{models_path}/models/db');

const db = new MySQL('{name_of_database_to_use}');

console.log('connection')

module.exports = db;