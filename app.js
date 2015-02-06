var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var ruby = require('./routes/ruby');
var gfsimgs = require('./routes/gfsimgs');
var bbs = require('./routes/bbs');

var mongoose = require('mongoose');
var gridform = require('gridform');
var Grid = require('gridform').gridfsStream;
var gm = require('gm');
var Ruby = require('./models/ruby');
var Post = require('./models/post');

//ejs
var ejs = require('ejs');
var moment = require('moment-timezone');
moment.locale('zh-cn');
ejs.filters.dateFormat = function(date) {
    var ret = moment(date).tz("Asia/Shanghai").fromNow();
    return ret;
};


var app = express();

//socket.io thing
var server = require('http').Server(app);
server.listen(3000);

var io = require('socket.io')(server);
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var gfs = null;

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
io.of('/bbs').on('connection', function(socket) {
    socket.on('post', function(data) {
        var post = new Post({
            title: data.title,
            content: data.content,
            imgs: data.wids,
            thumbnails: data.tids,
            categoryId: data.category_id
            //user_id:
        });

        post.save(function (err) {
            if (err) {
                console.log(err);
                return;
            }
            socket.emit('all-end');
        })

    });

    ss(socket).on('img', function(stream, data) {
        gfs = Grid(mongoose.connection.db, mongoose.mongo);
        var writestream = gfs.createWriteStream({
        });
        var tws = gfs.createWriteStream({
        });

        //progress
        var uploaded = 0;
        var progress = 0;
        stream.on('data', function (chunk) {
            uploaded += chunk.length;
            progress = uploaded / data.size * 100;
            socket.emit('progress', {img_num:data.img_num, progress:progress});
            console.log("on upload progress:" + uploaded / data.size * 100);
        });
        stream.on('end', function () {
            socket.emit('end-upload', {sum: data.sum, wid:writestream.id, tid: tws.id});
        });

        //error
        stream.on('error', function (err) {
            console.log(err);
            socket.emit('stream-error', err);
        });

        //save to grid


        stream.pipe(writestream);
        gm(stream)
            .resize('200', '200')
            .stream('png')
            .pipe(tws);
    });




});


//socket.io logic
io.of('/user').on('connection', function(socket) {
    console.log("connection");

    ss(socket).on('profile-image', function(stream, data) {
        console.log("saving...");
        //process tags
        data.tags = data.tags || null;
        if(data.tags && (data.tags != '') ) {
            data.tags = data.tags.split(' ');
            var tags = [];
            data.tags.forEach(function(tag) {
               if (tag != ' ') {
                   tags.push(tag);
               }
            });
            data.tags = tags;
        }
        //init id gfs stream
        gfs = Grid(mongoose.connection.db, mongoose.mongo);
        //var iid = mongoose.Types.ObjectId();
        var writestream = gfs.createWriteStream({
            //_id: iid.toString(),
            mode: 'w',
            content_type: 'image/png'
        });
        var tws = gfs.createWriteStream({
            mode: 'w',
            filename: 'thumbnail' + '.png',
            content_type: 'image/png'
        });

        //progress
        var uploaded = -1000;
        var progress = 0;
        stream.on('data', function (chunk) {
            uploaded += chunk.length;
            progress = uploaded / data.size * 100;
            socket.emit('progress', progress);
            console.log("onupload progress:" + uploaded / data.size * 100);
        });
        stream.on('end', function () {

            var ruby = new Ruby({
                imgId: writestream.id,
                thumbnailId: tws.id,
                tags: data.tags,
                nice: false
                //user_id:
            });

            ruby.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                progress = 100;
                socket.emit('progress', progress);
            })

        });

        //error
        stream.on('error', function (err) {
            console.log(err);
            socket.emit('stream-error', err);
        });

        //save to grid


        stream.pipe(writestream);
        gm(stream)
            .resize('200', '200')
            .stream('png')
            .pipe(tws);
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
app.use('/gfsimgs', gfsimgs);
app.use('/bbs', bbs);

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
