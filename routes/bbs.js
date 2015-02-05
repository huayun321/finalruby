var express = require('express');
var router = express.Router();
var Category = require('../models/category');
var Post = require('../models/post');
var gridform = require('gridform');
var mongoose = require('mongoose');
var Grid = require('gridform').gridfsStream;
var gm = require('gm');

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

router.post('/new', function(req, res) {
    var form = gridform();



    form.on('error', function(err) {
        console.log("======form err" + err);
    });

    form.on('fileBegin', function (name, file) {
        console.dir(file);
    });


    // parse normally
    form.parse(req, function (err, fields, files) {
        if(err) {
            console.dir(err);
            //todo handle err
        }

        //var file = files.upload;
        console.dir(fields);
        console.dir(files);

        //var gfs = Grid(mongoose.connection.db, mongoose.mongo);
        //// passing a stream
        //var readstream = gfs.createReadStream({
        //    _id: file.id
        //});
        //
        //var wid = mongoose.Types.ObjectId();
        //console.log("=============wid========" + wid);
        //var writestream = gfs.createWriteStream({
        //    _id: wid.toString(),
        //    mode: 'w',
        //    filename: 'thumbnail' + file.id + '.png',
        //    content_type: 'image/png'
        //
        //});
        ////
        //gm(readstream)
        //    .resize('200', '200')
        //    .stream('png')
        //    .pipe(writestream);
        //
        //
        //var m = new Material({
        //    imgId: file.id,
        //    thumbnailId: wid
        //});
        ////
        //m.save(function(err) {
        //    if(err) {
        //        console.log(err);
        //        return;
        //    }
        //    req.flash('success', 'material added');
        //    res.redirect('/material');
        //
        //})



    });

});

module.exports = router;