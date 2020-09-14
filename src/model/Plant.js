const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
    scientificName: {
        type: String,
        require: true
    },
    Family: {
        type: String,
        require: true
    },
    gbifID: {
        type: String,
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