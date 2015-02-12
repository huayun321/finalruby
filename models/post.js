
var mongoose = require('mongoose');

var schema = mongoose.Schema({
  title: { type: String, index: true, default: '' },
  content: { type: String,  default: '' },
  createdOn: { type: Date, default: Date.now },
  imgs:[mongoose.Schema.Types.ObjectId],
  thumbnails:[mongoose.Schema.Types.ObjectId],
  category: {type:mongoose.Schema.Types.ObjectId, ref: 'category'},
  createdBy: {type:mongoose.Schema.Types.ObjectId, ref: 'users'}
});



//schema.statics.getPostsByCategorys = function (categorys, cb) {
//    categorys.foreach(function(category) {
//        this.find({ name: new RegExp(name, 'i') }, cb);
//    });
//
//}

var Post = mongoose.model('posts', schema);
module.exports = Post;

