const mongoose = require('mongoose');

var ItemSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
},{
    timestamps: true
});

module.exports = Item = mongoose.model('Item', ItemSchema);