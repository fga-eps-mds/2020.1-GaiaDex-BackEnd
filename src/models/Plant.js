const mongoose = require("mongoose");

const PlantSchema = new mongoose.Schema({
    scientificName: {
        type: String,
        require: true,
        unique: true
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
        require: true
    },
    extinction: {
        type: Boolean,
        require: true
    },
    profile_picture: {
        type: String,
        require : true
    },   
    gbifID: {
        type: Number,
        require: true,    
    },
    stateProvince: {
        type: String,
        require : true
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
    }],
});


const Plant = mongoose.model("Plant",PlantSchema);

module.exports = Plant;
