var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_choyo',
  password        : '8420',
  database        : 'cs340_choyo'
});

module.exports.pool = pool;