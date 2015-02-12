var express = require('express');
var router = express.Router();
var Ruby = require('../models/ruby');


/* GET board page by ruby id. */
router.get('/:id', function(req, res) {

    Ruby.findById(req.params.id)
        .populate('createdBy')
        .exec(function(err, ruby) {
        if (err) {
            console.log("db find error in get /ruby/" + "id" + ": " + err);
            res.render('500');
        } else if (!ruby) {
            res.render('404');
        } else {
            res.render('ruby/ruby', {title:'宝石', ruby: ruby});
            //res.json(ruby);
        }

    });

});

router.get('/del/:id', function(req, res) {

    Ruby.findByIdAndRemove(req.params.id)
        .exec(function(err) {
            if (err) {
                console.log("db find error in get /ruby/" + "id" + ": " + err);
                res.render('500');
            } else {
                user = req.user;
                var index = user.rubies.indexOf(req.params.id);
                delete user.rubies[index];
                user.save(function(err) {
                    if(err) {
                        console.log("db find error in get /ruby/del/:id" + "id" + ": " + err);
                        res.render('500');
                    } else {
                        req.flash('success', '删除成功');
                        res.redirect('/users/profile');
                    }
                })

                //res.json(ruby);
            }

        });

});

router.get('/like/:id', function(req, res) {
    var user = req.user;
    user.likes.push(req.params.id);
    user.save(function(err) {
        if(err) {
            console.log("db save error in get /ruby/like/:id" + "id" + ": " + err);
            res.render('500');
        } else {
            req.flash('success', '收藏成功');
            res.redirect('/ruby/' + req.params.id);
        }
    })
});

router.get('/unlike/:id', function(req, res) {

    var user = req.user;
    var index = user.likes.indexOf(req.params.id);
    delete user.likes[index];
    user.save(function(err) {
        if(err) {
            console.log("db save error in get /ruby/unlike/:id" + "id" + ": " + err);
            res.render('500');
        } else {
            req.flash('success', '取消收藏成功');
            res.redirect('/ruby/' + req.params.id);
        }
    })


});

module.exports = router;