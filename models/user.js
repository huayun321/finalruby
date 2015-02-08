var mongoose = require('mongoose');
var bcrypt = require('bcrypt'); // or 'bcrypt-node'

var schema = mongoose.Schema({
    email: {type: String, require: true, trim: true, unique: true},
    password: {type: String, require: true},
    admin: {type: Boolean, default: false}
});

schema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.isValidPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('users', schema);
module.exports = User;