var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); // or 'bcrypt-node'
//var Post = require('./post');

var schema = mongoose.Schema({
    email: {type: String, require: true, trim: true, unique: true},
    password: {type: String, require: true},
    admin: {type: Boolean, default: false},

    name: {type: String, trim: true, unique: true, default:'佚名'},
    avatar: mongoose.Schema.Types.ObjectId,
    rubies: [{type:mongoose.Schema.Types.ObjectId, ref: 'ruby'}],
    likes: [{type:mongoose.Schema.Types.ObjectId, ref: 'ruby'}],
    posts: [{type:mongoose.Schema.Types.ObjectId, ref: 'posts'}],
    flowing: [{type:mongoose.Schema.Types.ObjectId, ref: 'users'}]


});

schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('users', schema);
module.exports = User;