const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myPlantSchema = new mongoose.Schema({
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
    }
});


const myPlant = mongoose.model('MyPlants', myPlantSchema);

module.exports = myPlant;
