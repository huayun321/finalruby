var mongoose = require('mongoose');

var schema = mongoose.Schema({
    imgId: mongoose.Schema.Types.ObjectId,
    thumbnailId: mongoose.Schema.Types.ObjectId,
    tags: [String],
    createdBy: {type:mongoose.Schema.Types.ObjectId, ref: 'users'},
    nice: Boolean,
    createdOn: { type: Date, default: Date.now }
});

var Ruby = mongoose.model('ruby', schema);
module.exports = Ruby;

