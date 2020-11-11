const mongoose = require('mongoose');

const { Schema } = mongoose;

const topicSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    require: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Like',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
