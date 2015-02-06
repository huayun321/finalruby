
var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: String,
  content: String,
  createdOn: { type: Date, default: Date.now },
  imgs:[mongoose.Schema.Types.ObjectId],
  thumbnails:[mongoose.Schema.Types.ObjectId],
  category: {
      id: mongoose.Schema.Types.ObjectId,
      name: String
  },
  user: {
      id: mongoose.Schema.Types.ObjectId,
      username: String
  }
});

var Post = mongoose.model('posts', schema);
module.exports = Post;

