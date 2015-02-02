var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var ruby = require('./routes/ruby');

var mongoose = require('mongoose');
var gridform = require('gridform');
var Grid = require('gridform').gridfsStream;
var gm = require('gm');

var app = express();

//socket.io thing
var server = require('http').Server(app);
server.listen(3000);

var io = require('socket.io')(server);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');

//async
var async = require('async');


// database connection
mongoose.connect('mongodb://localhost/ff3');
var db = mongoose.connection;

db.on('error', function(msg) {
    console.log('Mongoose connection error %s', msg);
});

db.once('open', function() {
    console.log('Mongoose connection established');
    gridform.db = db.db;
    gridform.mongo = mongoose.mongo;
});

//socket.io logic
io.of('/user').on('connection', function(socket) {
    console.log("connection");

    ss(socket).on('profile-image', function(stream, data) {
        console.log("saving...");
        console.log(data)

        //progress
        var uploaded = 0;
        var progress = 0;
        stream.on('data', function(chunk) {
            uploaded+= chunk.length;
            progress = uploaded / data.size * 100;
            socket.emit('progress', progress);
            console.log("onupload progress:" + data.other + uploaded / data.size * 100);
        });
        stream.on('end', function() {
            progress = 100;
            socket.emit('progress', progress);
        });

        //error
        stream.on('error', function(err) {
            console.log(err);
            socket.emit('stream-error', err);
        });

        //save to grid
        var gfs = Grid(mongoose.connection.db, mongoose.mongo);
        var wid = mongoose.Types.ObjectId();
        stream.pipe(fs.createWriteStream("copy.png"));
    });

});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/ruby', ruby);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
