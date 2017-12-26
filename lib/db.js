var mysql = require('mysql');
var db = {};
db.query = function sqlback(sqlstr, fn) {
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Akashi12',
        port: 3306,
        database: 'userinfo'
    });
    connection.connect(function(err) {
        if (err) {
            console.log(err);
            return;
        }
    });
    var sql = sqlstr;
    if (!sql) return;
    connection.query(sql, function(err, rows, field) {
        if (err) {
            console.log(err);
            return;
        }
        fn(rows);
    });
    connection.end(function(err) {
        if (err) {
            return;
        } else {

        }
    });
}

module.exports = db;