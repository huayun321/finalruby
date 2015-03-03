var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var routes = require('./routes/index');
var users = require('./routes/user');
var board = require('./routes/board');
var gfsimgs = require('./routes/gfsimgs');
var bbs = require('./routes/bbs');
var isLogin = require('./routes/isLogin');
var ruby = require('./routes/ruby');

var mongoose = require('mongoose');
var gridform = require('gridform');
var Grid = require('gridform').gridfsStream;
var gm = require('gm');
var Ruby = require('./models/ruby');
var Post = require('./models/post');

var passport = require('passport');
var User = require('./models/user');
var Category = require('./models/category');

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

//socket.io index logic
io.of('/index').on('connection', function(socket) {
   socket.on('like', function(data) {
       User.findById(data.user_id)
           .populate('rubies')
           .exec(function(err, user) {
           if(err) {
               console.log(err);
               socket.emit('error', 'error on find user');
           } else {
               user.likes.push(data.ruby_id);
               user.save(function(err) {
                   if(err) {
                       console.log(err);
                       socket.emit('error', 'save on find user');
                   } else {
                       socket.emit('ok', '收藏成功');
                   }
               });
           }
       });
   });
    socket.on('unlike', function(data) {
        User.findById(data.user_id)
            .populate('rubies')
            .exec(function(err, user) {
                if(err) {
                    console.log(err);
                    socket.emit('error', 'error on find user');
                } else {
                    var index = user.likes.indexOf(data.ruby_id);
                    user.likes.remove(data.ruby_id);
                    user.save(function(err) {
                        if(err) {
                            console.log(err);
                            socket.emit('error', 'error on save user');
                        } else {
                            socket.emit('ok', '取消收藏成功');
                        }
                    });
                }
            });
    });
});
//socket.io logic
io.of('/bbs').on('connection', function(socket) {
    ss(socket).on('avatar', function(stream, data) {
        var user_id = data.user_id;
        gfs = Grid(mongoose.connection.db, mongoose.mongo);
        var writestream = gfs.createWriteStream({
        });
        //progress
        var uploaded = 0;
        var progress = 0;
        stream.on('data', function (chunk) {
            uploaded += chunk.length;
            progress = uploaded / data.size * 100;
            socket.emit('progress', {progress:progress});
            console.log("on upload progress:" + uploaded / data.size * 100);
        });
        stream.on('end', function () {
            User.findById(user_id, function(err, user) {
               if(err) {
                   socket.emit('err', err);
               } else {
                   user.avatar = writestream.id;
                   user.save(function(err) {
                       if(err) {
                           socket.emit('err', err);
                       } else {
                           socket.emit('end-upload');
                       }
                   });
               }
            });

        });

        //error
        stream.on('error', function (err) {
            console.log(err);
            socket.emit('err', err);
        });

        //save to grid
        gm(stream)
            .resize('200', '200')
            .stream('png')
            .pipe(writestream);

    });

    socket.on('post', function(data) {
        var post = new Post({
            title: data.title,
            content: data.content,
            imgs: data.wids,
            thumbnails: data.tids,
            category: data.category_id,
            createdBy: data.user_id
            //user: {}
        });

        post.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                User.findById(data.user_id, function(err, user) {
                    if(err) {
                        console.log(err);
                        return;
                    } else {
                        user.posts.push(post.id);
                        user.save(function(err) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                    }
                })
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
            console.log('wid and tid ' + writestream.id + "===" + tws.id);
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

        if(data.tags.trim() == '') {
            data.tags = null;
        } else {
            data.tags = data.tags.trim().split(/\s+/);
            var tags = [];
            data.tags.forEach(function(tag) {
                if(tag.length <= 20) {
                    tags.push(tag);
                }

            });
            if(tags.length >= 1) {
                data.tags = tags;
            } else {
                data.tags = null;
            }

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
                nice: false,
                createdBy: data.user_id
            });

            ruby.save(function (err) {
                if (err) {
                    console.log(err);
                    return;
                }


                User.findById(data.user_id, function(err,user) {
                   if(err) {
                       socket.emit('err', err);
                   } else {
                       user.rubies.push(ruby.id);
                       user.save(function(err) {
                           if(err) {
                               socket.emit('err', err);
                           } else {
                               progress = 100;
                               socket.emit('progress', progress);
                           }
                       });
                   }
                });

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
app.use(session({secret: 'secret', resave: true, saveUninitialized: true, cookie: { maxAge: 2592000000 }}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
app.use(flash());
app.use(function(req, res, next) {
    res.locals.message = req.flash();
    next();
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/board', isLogin, board);
app.use('/gfsimgs', gfsimgs);
app.use('/bbs', isLogin, bbs);
app.use('/ruby', isLogin, ruby);

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
