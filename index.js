const path = require("path");
const express = require("express");
const routes = require('./routes');
var session = require('express-session');
// const flash = require('connect-flash');
const app = express();

//这样才能在post中用req.body取得数据，否则为undefined
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');

// 设置模板引擎为 html
// app.engine("html", require("ejs").renderFile);
// app.set('view engine', 'html');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
    },
}));

// flash 中间件，用来显示通知
// app.use(flash())

// app.use(function(req, res, next) {
//     res.locals.user = req.session.user
//     res.locals.success = req.flash('success').toString()
//     res.locals.error = req.flash('error').toString()
//     next()
// })

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.');
});


// 路由
routes(app)