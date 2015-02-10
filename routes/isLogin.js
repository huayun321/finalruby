function isLogin(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('danger', '请先登录');
        req.session.redirect = req.originalUrl;
        res.redirect('/users/login');
    }  else {
        res.locals.message.isLogin = true;
        res.locals.user = req.user;
        next();
    }
}

module.exports = isLogin;