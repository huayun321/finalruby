var express = require('express');
var router = express.Router();
var Ruby = require('../models/ruby');

/* GET home page. */
router.get('/', function(req, res) {
    Ruby.find({}).exec(function(err, rubies) {
        if (err) {
            console.log("db error in GET /rubies: " + err);
            res.render('500');
        } else {
            res.render('index', {title:'918diy', rubies: rubies});
        }
    });

});

module.exports = router;
