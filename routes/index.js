var express = require('express');
var router = express.Router();
var Ruby = require('../models/ruby');

/* GET home page. */
router.get('/', function(req, res) {
    Ruby.find()
        .populate('createdBy')
        .sort('-createdOn')
        .exec(function(err, rubies) {
        if (err) {
            console.log("db error in GET /rubies: " + err);
            res.render('500');
        } else {
            if(req.user) {
                res.render('index', {title:'918diy', rubies: rubies, user:req.user});
            } else {
                res.render('index', {title:'918diy', rubies: rubies, user:null});
            }

        }
    });

});

module.exports = router;
