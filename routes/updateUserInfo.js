const express = require("express");
const router = express.Router();
const mysql = require('../lib/db.js');

router.post('/updateUserInfo', function(req, res) {
    console.log("send");
    var name = req.body.nickname; //字符串，用户的昵称
    var age = req.body.age; //整型，用户的年龄
    var address = req.body.address; //字符串，表示地址
    var introduction = req.body.introduction; //字符串，用户的自我介绍
    var mailbox = req.body.mailbox; //字符串，用户的email

    var sql = "update userinfo set username ='" + name + "',age = " + age + ",address ='" + address + "',introduction = '" + introduction + "',mailbox = '" + mailbox + "' where user_id = " + req.session.userid;
    console.log(sql);

    var result = mysql.query(sql, function(result) {
        console.log(result);
        if (result != 0) {
            res.json({ "result": "success" });
        } else {
            res.json({ "result": "failed", "reason": "eeeeee" });
        }
    })
})

module.exports = router;