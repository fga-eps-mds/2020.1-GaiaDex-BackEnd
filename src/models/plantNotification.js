const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationsSchema = new mongoose.Schema({
    water: {
        type: String,
    },
    fertilize: {
        type: String,
    },
});


const plantNotification = mongoose.model('plantNotification', notificationsSchema);

module.exports = plantNotification;