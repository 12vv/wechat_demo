const express = require("express");
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;
const mysql = require('../lib/db.js');

var beforelen = 0;

router.get('/getUnreadChatRecord', checkLogin, function(req, res, next) {
    console.log("before:" + beforelen);
    console.log("myid: " + req.session.userid);
    var sql = "select * from chatrecord where receiver_id =" + req.session.userid;
    var result = mysql.query(sql, function(result) {
        len = result.length;
        console.log("now:" + len);
        if (len != beforelen) {
            var data = [];
            console.log(result);
            if (result != 0) {
                for (var i = beforelen; i < len; i++) {
                    var indata = {
                        "sender": result[i].sender_id,
                        "receiver": result[i].receiver_id,
                        "content": result[i].content,
                        "date": result[i].date,
                    }
                    data.push(indata);
                }
                beforelen = len;
                console.log(data);
                res.json(data);
            }
        }

    })
})

module.exports = router;