var mongoose = require('mongoose');

var schema = mongoose.Schema({
    name: {type: String, default: ""},
    description: {type: String, default: ""},
    date: { type: Date, default: Date.now }
});

var Category = mongoose.model('category', schema);
module.exports = Category;

