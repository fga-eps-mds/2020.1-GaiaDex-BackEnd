const mongoose = require('../database/BancoMongo.js');

const PlantSchema = new mongoose.Schema({
    scientificName: {
        type: String,
        require: true
    },
    family_name: {
        type: String,
        require: true
    },
    gender_name: {
        type: String,
        require: true
    },
    specie_name: {
        type: String,
        require: true
    },
    common_name: {
        type: String,
        require: true
    },
    usage: {
        type: String,
        require: true
    },
    first_User: {
        type: String,
        require: true
    },
    collection_count: {
        type: Number,
        require: true,
        unique: true
    },
    extinction: {
        type: Boolean,
        require: true
    },
    profile_picture: {
        type: Number,
        require : true
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
    topicos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'topic',
  
    }],
});


const Plant = mongoose.model('plant',PlantSchema);

module.exports = Plant;