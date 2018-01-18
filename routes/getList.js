const express = require("express");
const router = express.Router();
const checkLogin = require('../middlewares/check').checkLogin;
const mysql = require('../lib/db.js');

router.get('/getList', checkLogin, function(req, res) {
    var isReturn = false;
    console.log("getlist");
    var sql1 = "select * from friends where user_id =" + req.session.userid;
    var data = [];
    console.log(sql1);
    var result = mysql.query(sql1, function(result) {
        console.log(result);
        if (result != 0) {
            for (var i = 0; i < result.length; i++) {
                var sql2 = "select * from userinfo where user_id =" + result[i].friend_id;
                console.log(sql2);
                var result1 = mysql.query(sql2, function(result1) {
                    if (result1 != null) {
                        console.log(result1[0].username);
                        var indata = {
                            "id": result1[0].user_id, //字符串
                            "nickname": result1[0].username, //字符串，用户的昵称
                        }
                        data.push(indata);
                    }
                })
            }
        }
        isReturn = true;
    })
    setTimeout(function() {
        if (isReturn == true) {
            console.log(data);
            res.json(data);
        }
    }, 50)
})

module.exports = router;