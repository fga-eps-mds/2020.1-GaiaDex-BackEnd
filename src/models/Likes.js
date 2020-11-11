const mongoose = require('mongoose');

const { Schema } = mongoose;

const likeSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: 'Topic',
        
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        
    },
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
