const express = require("express");
const router = express.Router();
const mysql = require('../lib/db.js');

router.get('/getChatRecord', function(req, res, next) {
    console.log("getrecord");
    var urllib = require('url');
    var params = urllib.parse(req.url, true);
    const friendid = params.query.id;

    var sql = "select * from chatrecord where (sender_id =" + req.session.userid + "&& receiver_id = " + friendid + ") || sender_id =" + friendid + "&& receiver_id = " + req.session.userid;
    var result = mysql.query(sql, function(result) {
        var data = [];
        console.log(result);
        if (result != 0) {
            for (var i = 0; i < result.length; i++) {
                var indata = {
                    "sender": result[i].sender_id,
                    "receiver": result[i].receiver_id,
                    "content": result[i].content,
                    "date": result[i].date,
                }
                data.push(indata);
            }
            console.log(data);
            res.json(data);
        }
    })
})

module.exports = router;