
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    content: { type: String,  default: '' },
    createdOn: { type: Date, default: Date.now },
    createdBy: {type:mongoose.Schema.Types.ObjectId,  ref: 'users'},
    post: {type:mongoose.Schema.Types.ObjectId, index:true, ref: 'posts'}
});

var Comment = mongoose.model('comments', schema);
module.exports = Comment;