const mongoose = require('mongoose');

const { Schema } = mongoose;

const CollectionSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  myPlants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'MyPlants',
      require: true,
    },
  ],
});

const Collection = mongoose.model('Collection', CollectionSchema);

module.exports = Collection;
