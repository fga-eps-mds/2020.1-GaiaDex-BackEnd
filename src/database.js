const mongoose = require('mongoose');

// // MongoDB connection
// // mongodb://localhost:27017/noderest  => meu banco de dados local polupado
// // mongodb://mongo:27017/backend => banco de dados da develop
// mongoose
//   .connect('mongodb://mongo:27017/backend', {
//     useNewUrlParser: true,
//     // useUnifiedTopology: true,
//   })
//   .then(() => console.log('MongoDB Connected'))
//   .catch((err) => console.log(err));

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(
      process.env.NODE_ENV === 'test'
        ? global.__DB_URL__
        : 'mongodb://mongo:27017/backend',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
  }
};

const truncate = async () => {
  if (mongoose.connection.readyState !== 0) {
    const { collections } = mongoose.connection;

    const promises = Object.keys(collections).map((collection) =>
      mongoose.connection.collection(collection).deleteMany({})
    );

    await Promise.all(promises);
  }
};

const disconnect = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

module.exports = {
  connect,
  truncate,
  disconnect,
};
