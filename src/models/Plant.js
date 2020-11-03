const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  scientificName: {
    type: String,
    require: true,
    unique: true,
  },
  familyName: {
    type: String,
    require: true,
  },
  genderName: {
    type: String,
    require: true,
  },
  specieName: {
    type: String,
  },
  commonName: {
    type: String,
    require: true,
  },
  usage: {
    type: String,

  },
  firstUser: {
    type: String,

  },
  collectionCount: {
    type: Number,

  },
  extinction: {
    type: Boolean,

  },
  profilePicture: {
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
