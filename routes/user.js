var express = require('express');
var router = express.Router();
var User = require('../models/user');
var isLogin = require('../routes/isLogin');

/* GET users by name */
router.get('/signup', function(req, res) {
  res.render('users/signup', {title: '用户注册'});
});

router.post('/signup', function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            res.render('500');
        } else if (user) {
            req.flash('danger', '用户邮箱已经被注册！');
            res.redirect('/users/signup');
        } else {
            var user = new User();
            user.email = req.body.email;
            user.password = user.generateHash(req.body.password);

            user.save(function(err) {
                if (err) {
                    console.log(err);
                    res.render('500');
                } else {
                    req.login(user, function(err) {
                        if(err) {
                            res.render('500');
                        } else {
                            res.redirect('/users/profile');
                        }
                    });
                }
            });
        }
    });
});


router.get('/profile', isLogin, function(req, res) {
    User
        .findById(req.user.id)
        .populate('posts')
        .populate('rubies')
        .exec(function(err, user) {
            if (err) {
                res.render('500');
            } else if (!user) {
                res.render('404');
            } else {
                res.render('users/profile', {title: '用户资料', user:user})
            }
        });
});


router.get('/login', function(req, res) {
    res.render('users/login', {title: '用户登录'});
});


router.post('/login', function(req, res) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            res.render('500');
        } else if (!user || !user.isValidPassword(req.body.password)) {
            req.flash('danger', '用户名或密码错误');
            res.redirect('/users/login');
        } else {
            req.login(user, function(err) {
                if (err) {
                    res.render('500');
                } else {
                    if (req.session.redirect) {
                        res.redirect(req.session.redirect);
                        delete req.session.redirect;
                    } else {

                        res.redirect('/users/profile');
                    }
                }
            });
        }
    });
});

router.get('/logout', function(req, res) {
    req.flash('success', "You're now logged out.");
    res.redirect('/index');
});

//user profile change
router.post('/change-name',  isLogin, function(req, res) {

    User
        .findById(req.user.id)
        .exec(function(err, user) {
            if (err) {
                res.render('500');
            } else if (!user) {
                res.render('404');
            } else {
                user.name = req.body.name;
                user.save(function(err) {
                    if (err) {
                        res.render('500');
                    } else {
                        req.flash('success', "成功修改。");
                        res.redirect('/users/profile');
                    }
                });

            }
        });
});

router.get('/change-password',  isLogin, function(req, res) {
    res.render('users/password', {title: '密码修改'});
});

router.post('/change-password',  isLogin, function(req, res) {
    if(!req.user.isValidPassword(req.body.old_password)) {
        req.flash('danger', "旧密码错误。");
        res.redirect('/users/change-password');

    } else if (!req.body.new_password || req.body.new_password=='') {
        req.flash('danger', "新密码不能为空。");
        res.redirect('/users/change-password');

    } else if(req.body.new_password != req.body.new_password2) {
        req.flash('danger', "两个新密码不相同。");
        res.redirect('/users/change-password');

    } else {

        User
            .findById(req.user.id)
            .exec(function(err, user) {
                if (err) {
                    res.render('500');
                } else if (!user) {
                    res.render('404');
                } else {
                    user.password = user.generateHash(req.body.new_password);
                    user.save(function(err) {
                        if (err) {
                            res.render('500');
                        } else {
                            req.flash('success', "成功修改。");
                            res.redirect('/users/change-password');
                        }
                    });

                }
            });

    }


});

router.get('/change-avatar',  isLogin, function(req, res) {
    res.render('users/avatar', {title: '头像修改'});
});


module.exports = router;
