var mongoose = require('mongoose');

var schema = mongoose.Schema({
    imgId: mongoose.Schema.Types.ObjectId,
    thumbnailId: mongoose.Schema.Types.ObjectId,
    tags: [String],
    userId: mongoose.Schema.Types.ObjectId,
    nice: Boolean,
    createdOn: { type: Date, default: Date.now }
});

var Ruby = mongoose.model('ruby', schema);
module.exports = Ruby;

