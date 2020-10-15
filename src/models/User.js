const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Favorites',
        require: true,
    }],
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topics',
        require: true,
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
