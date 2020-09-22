const MySQL = require('{models_path}/models/db');

const db = new MySQL('portfolio');

console.log('connection')

module.exports = db;