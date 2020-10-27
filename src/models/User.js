const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topics',
      require: true,
    },
  ],
    myPlants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "MyPlants",
        require: true,
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
