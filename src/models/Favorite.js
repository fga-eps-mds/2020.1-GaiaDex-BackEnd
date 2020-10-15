const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    nickname: {
        type: String,
        required: true
    },
    plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plants',
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Favorite = mongoose.model('Favorites', favoriteSchema);

module.exports = Favorite;
