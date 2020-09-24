const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    completed: {
        type: Boolean,
        require: true,
        default: false,
    },
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
