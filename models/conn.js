var mongoose = require('mongoose');
var gridform = require('gridform');

// database connection
mongoose.connect('mongodb://localhost/ruby');
var db = mongoose.connection;

db.on('error', function(msg) {
    console.log('Mongoose connection error %s', msg);
});

db.once('open', function() {
    console.log('Mongoose connection established');
    gridform.db = db;
    gridform.mongo = mongoose.mongo;
});

module.exports = gridform;