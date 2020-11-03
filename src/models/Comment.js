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
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
