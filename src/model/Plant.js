const mongoose = require('../database/BancoMongo.js');

const PlantSchema = new mongoose.Schema({
    scientificName: {
        type: String,
        require: true
    },
    family: {
        type: String,
        require: true
    },
    gbifID: {
        type: Number,
        require: true,
        unique:true    
    },
    stateProvince: {
        type: String,
        require : true
    },
});


const Plant = mongoose.model('Plant',PlantSchema);

module.exports = Plant;