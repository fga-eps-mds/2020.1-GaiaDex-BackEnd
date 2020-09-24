const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
        type: String,
        require: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topics',
        require: true
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
