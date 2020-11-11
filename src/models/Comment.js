const mongoose = require('mongoose');

const { Schema } = mongoose;

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  topic: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
    require: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Like',
  }],
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
