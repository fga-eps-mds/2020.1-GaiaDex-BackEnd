const mongoose = require('mongose');

mongoose.connect('mongodb://localhost/noderest', { useMongoClient: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;
