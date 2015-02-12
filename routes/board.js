var express = require('express');
var router = express.Router();
var Template = require('../models/template');

/* GET template list  page. */
router.get('/', function(req, res) {
    Template.find({}).exec(function(err, templates) {
        if (err) {
            console.log("db error in GET /templates: " + err);
            res.render('500');
        } else {
            res.render('board/list', {title:'模板列表', templates: templates});
        }
    });
});

/* GET board page by template name. */
router.get('/:id', function(req, res) {

    Template.findById(req.params.id, function(err, template) {
        if (err) {
            console.log("db find error in get /template/" + "id" + ": " + err);
            res.render('500');
        } else if (!template) {
            res.render('404');
        } else {
            res.render('board/board', {title:'ruby', template: template});
        }
    });

});

module.exports = router;