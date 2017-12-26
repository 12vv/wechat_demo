const express = require("express");
const router = express.Router();
const mysql = require('../lib/db.js');

//日期
Date.prototype.Format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

router.post('/sendContent', function(req, res) {
    console.log("send");
    var receiver = req.body.receiver;
    var content = req.body.content;
    var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
    var sql = "insert into chatrecord(sender_id,receiver_id,content,date) values (" + req.session.userid + "," + receiver + ",'" + content + "','" + date + "')";
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