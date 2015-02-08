var express = require('express');
var router = express.Router();
var User = require('../models/user');

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
                    res.render('500');
                } else {
                    req.flash('success', "Thank's for signing up! You're now logged in.")
                    res.redirect('/users/profile');
                }
            });
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
            req.flash('success', "You're now logged in.");
            res.redirect('/posts');
        }
    });
});

router.get('/logout', function(req, res) {
    req.flash('success', "You're now logged out.");
    res.redirect('/posts');
});

module.exports = router;
