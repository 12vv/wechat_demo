module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.userid) {
            console.log("未登录");
            //req.flash('error', '未登录')
            //return res.location('/'); //页面不跳转？？
            return;
        }
        next()
    },

    // checkNotLogin: function checkNotLogin(req, res, next) {
    //     if (req.session.user) {
    //         req.flash('error', '已登录')
    //         return res.redirect('back') // 返回之前的页面
    //     }
    //     next()
    // }
}