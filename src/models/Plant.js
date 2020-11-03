const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  scientificName: {
    type: String,
    require: true,
    unique: true,
  },
  family_name: {
    type: String,
    require: true,
  },
  gender_name: {
    type: String,
    require: true,
  },
  specie_name: {
    type: String,
  },
  common_name: {
    type: String,
    require: true,
  },
  usage: {
    type: String,

  },
  first_User: {
    type: String,

  },
  collection_count: {
    type: Number,

  },
  extinction: {
    type: Boolean,

  },
  profile_picture: {
    type: String,

  },
  gbifID: {
    type: Number,
    require: true,
  },
  stateProvince: {
    type: String,

  },
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
    },
  ],
});

const Plant = mongoose.model('Plant', PlantSchema);

module.exports = Plant;
