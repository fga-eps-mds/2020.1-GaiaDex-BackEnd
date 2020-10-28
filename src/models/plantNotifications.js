const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationsSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    plant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Plant',
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    notifications: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'plantNotifications',
    }
});


const plantNotifications = mongoose.model('plantNotifications', notificationsSchema);

module.exports = plantNotifications;