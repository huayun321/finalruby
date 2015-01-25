var express = require('express');
var router = express.Router();
var Template = require('../models/template');
/* GET home page. */
router.get('/', function(req, res) {

    Template.findById("54c28fd4770fd50f578c7e66", function(err, template) {
        if (err) {
            console.log("db find error in get /template/" + "id" + ": " + err);
            res.render('500');
        } else if (!template) {
            res.render('404');
        } else {
            console.log("=============tname" + template.obj);
            res.render('ruby/board', {title:'ruby', template: template});
        }
    });

});

module.exports = router;