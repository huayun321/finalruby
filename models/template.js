var mongoose = require('mongoose');

var schema = mongoose.Schema({
    name: {type: String, default: ""},
    obj: {type: String, default: ""},
    description: {type: String, default: ""},
    date: { type: Date, default: Date.now }
});

var Template = mongoose.model('template', schema);
module.exports = Template;

