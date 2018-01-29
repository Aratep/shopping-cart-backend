const db = require('mongoose');
const url = 'mongodb://localhost:27017/shopping';
db.connect(url);
db.Promise = global.Promise;

module.exports = db;