var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Post = require('../models/post');
var gridform = require('gridform');
var mongoose = require('mongoose');
var Grid = require('gridform').gridfsStream;
var gm = require('gm');
var moment = require('moment-timezone');
var async = require('async');



/* GET template list  page. */
router.get('/', function(req, res) {
    console.log(req.user);
    Category.find({}).exec(function(err, categorys) {
        if (err) {
            console.log("db error in GET /categorys: " + err);
            res.render('500');
        } else {

            res.render('bbs/index', {title:'918diy社区', categorys: categorys});
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
            Post.find({category:req.params.id}).populate('createdBy').exec(function(err, posts) {

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
    //console.log(req.params.id);
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
            res.render('bbs/post', {title:post.title, post:post});
            //res.json(post);
        }
    });

});



module.exports = router;