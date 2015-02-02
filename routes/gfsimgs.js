var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Grid = require('gridform').gridfsStream;

/* GET home page. */
router.get('/:id', function(req, res) {
    var gfs = Grid(mongoose.connection.db, mongoose.mongo);
    // passing a stream
    var readstream = gfs.createReadStream({
        _id: req.params.id

    });
    console.log("gfsimgs++++++=====:" + req.params.id);
    readstream.pipe(res);
});

module.exports = router;
