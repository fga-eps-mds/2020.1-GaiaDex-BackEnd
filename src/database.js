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
// console.log(`db host ${process.env.DB_HOST}`);
// console.log(`db host ${process.env.DB_PORT}`);
// console.log(`db host ${process.env.DB_NAME}`);
// console.log(
//   `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
// );
// Pra subir pra produção: `mongo://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    let url;
    switch (process.env.NODE_ENV) {
      case 'production':
        url = `mongo://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
        break;
      case 'test':
        url = global.__DB_URL__;
        break;
      default:
        url = `mongodb://mongo:27017/backend`;
    }

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
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
