const express = require("express");
const router = express.Router();
const mysql = require('../lib/db.js');

router.get('/getUserInfo', function(req, res, next) {
    var urllib = require('url');
    var params = urllib.parse(req.url, true);
    const userid = params.query.id;

    var sql = "select * from userinfo where user_id =" + userid;
    var result = mysql.query(sql, function(result) {
        console.log(result);
        if (result != 0) {
            var data = {
                "address": result[0].address, //字符串
                "mailbox": result[0].mailbox, //字符串，用户的email
                "introduction": result[0].introduction, //字符串，用户设置的自我介绍
                "nickname": result[0].username, //字符串，用户的昵称
                "age": result[0].age, //字符，用户的年龄
            }
            res.json(data);
        }
    })
})

module.exports = router;