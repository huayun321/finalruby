
var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: String,
  content: String,
  createdOn: { type: Date, default: Date.now },
  imgs:[mongoose.Schema.Types.ObjectId],
  thumbnails:[mongoose.Schema.Types.ObjectId],
  categoryId: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.ObjectId
});

var Post = mongoose.model('posts', schema);
module.exports = Post;

