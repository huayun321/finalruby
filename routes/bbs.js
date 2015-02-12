var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Post = require('../models/post');
var Comment = require('../models/comment');
var gridform = require('gridform');
var mongoose = require('mongoose');
var Grid = require('gridform').gridfsStream;
var gm = require('gm');
var moment = require('moment-timezone');
var async = require('async');



/* GET template list  page. */
router.get('/', function(req, res) {

    async.auto({
        get_categorys: function(callback) {
            Category.find({}).exec(function(err, categorys) {
                callback(err, categorys);
            });

        },
        get_objs: ['get_categorys', function(callback, results) {
            var categorys = results.get_categorys;
            async.mapSeries(results.get_categorys, function(category, cb) {
                Post.find({'category':category.id})
                    .sort('-createdOn')
                    .limit(10)
                    .populate('createdBy', 'id name')
                    .exec(function(err, posts) {
                        console.dir(posts);
                        var index = categorys.indexOf(category);
                        categorys[index].posts = posts;
                        cb(err, posts);
                    });
            }, function(err, results) {
                callback(err, results);
            });
        }]

    }, function(err, results) {
        if(err) {
            console.log(err);
            res.render(404);
        } else {
            //res.json(results.get_objs);
            res.render('bbs/index', {title:'918diy社区', categorys:results.get_categorys, posts:results.get_objs});
        }


    });

});

/* GET bbs post form by category id. */
router.get('/new-post/category/:id', function(req, res) {

    Category.findById(req.params.id, function(err, category) {
        if (err) {
            console.log("db find error in get /category/" + "id" + ": " + err);
            res.render('500');
        } else if (!category) {
            res.render('404');
        } else {
            res.render('bbs/post_form', {title:'发帖', category: category});
        }
    });

});

/* GET article list by category id. */
router.get('/category/:id', function(req, res) {
    //console.log(req.params.id);
    Category.findById(req.params.id, function(err, category) {
        if (err) {
            console.log("db find error in get /category/" + "id" + ": " + err);
            res.render('500');
        } else if (!category) {
            res.render('404');
        } else {
            Post.find({category:req.params.id})
                .populate('createdBy')
                .sort('-createdOn')
                .exec(function(err, posts) {
                if (err) {
                    console.log("db error in GET /categorys: " + err);
                    res.render('500');
                } else {
                    //res.send(posts);
                    res.render('bbs/list', {title:category.name, category:category, posts: posts});
                }
            });
            //res.send(category);
        }
    });

});

/* GET article list by category id. */
router.get('/post/:id', function(req, res) {
    Post.findById(req.params.id)
        .populate('createdBy')
        .populate('category')
        .exec(function(err, post) {
        if (err) {
            console.log("db find error in get /post/" + "id" + ": " + err);
            res.render('500');
        } else if (!post) {
            res.render('404');
        } else {
            Comment.find({'post':req.params.id})
                .populate('createdBy')
                .exec(function(err, comments) {
                    if (err) {
                        console.log("db find error in get /post/" + "id" + ": " + err);
                        res.render('500');
                    } else {
                        res.render('bbs/post', {title:post.title, post:post, comments: comments});
                    }
                })

            //res.json(post);
        }
    });

});

router.post('/comment/', function(req, res) {
    comment = new Comment();
    comment.content = req.body.content;
    comment.createdBy = req.body.userid;
    comment.post = req.body.postid;
    comment.save(function(err) {
        if (err) {
            console.log("db save error in get /post-comment/" + "id" + ": " + err);
            res.render('500');
        } else {
            res.redirect('/bbs/post/'+req.body.postid);
        }
    });

});



module.exports = router;