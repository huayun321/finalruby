var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Post = require('../models/post');

/* GET template list  page. */
router.get('/', function(req, res) {
    Category.find({}).exec(function(err, categorys) {
        if (err) {
            console.log("db error in GET /categorys: " + err);
            res.render('500');
        } else {
            res.render('bbs/index', {title:'918diy社区', categorys: categorys});
        }
    });
});

/* GET ruby page by template name. */
router.get('/:id', function(req, res) {

    Template.findById(req.params.id, function(err, template) {
        if (err) {
            console.log("db find error in get /template/" + "id" + ": " + err);
            res.render('500');
        } else if (!template) {
            res.render('404');
        } else {
            res.render('ruby/board', {title:'ruby', template: template});
        }
    });

});

module.exports = router;