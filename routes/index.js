module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('signin')
    })
    app.get('/mainpage', function(req, res) {
        console.log("main")
        res.render('mainpage')
    })


    app.get('/logout', require('./logout'))
    app.get('/getUserInfo', require('./getUserInfo'))
    app.get('/getList', require('./getList'))
    app.post('/sendContent', require('./sendContent'))
    app.get('/getChatRecord', require('./getChatRecord'))
    app.post('/updateUserInfo', require('./updateUserInfo'))
    app.get('/getUnreadChatRecord', require('./getUnreadChatRecord'))
    app.use('/', require('./signin'))

}