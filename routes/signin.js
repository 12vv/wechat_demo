const express = require("express");
const router = express.Router();
const mysql = require('../lib/db.js');


router.get('/login', function(req, res, next) {
    var urllib = require('url');
    var params = urllib.parse(req.url, true);
    const account = params.query.account;
    const password = params.query.password;

    //直接这样获取不到参数
    // const account = req.query.name;
    // const password = req.query.password;

    var sql = "select * from userinfo where username =" + "'" + account + "' && password = " + "'" + password + "'";
    console.log(sql);
    var result = mysql.query(sql, function(result) {
        //登陆成功
        if (result != 0) {
            console.log("result != []");
            var userid = result[0].user_id;
            req.session.userid = userid;
            res.json({ "result": "success", "userid": '"' + userid + '"' });
        } else {
            res.json({ "result": "failed", "reason": "用户不存在或密码错误" });
        }
    })
})

module.exports = router;