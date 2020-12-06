const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
  },
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      require: true,
    },
  ],
  myPlants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MyPlants',
      require: true,
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      require: true,
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
