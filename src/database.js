const mongoose = require('mongoose');

const connect = async () => {
  if (mongoose.connection.readyState === 0) {
    let url;
    switch (process.env.NODE_ENV) {
      case 'homolog':
        url = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
        break;
      case 'production':
        url = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;
        break;
      case 'test':
        url = global.__DB_URL__;
        break;
      default:
        url = `mongodb://mongo:27017/backend`;
    }
    if (
      process.env.NODE_ENV === 'homolog' ||
      process.env.NODE_ENV === 'production'
    ) {
      await mongoose
        .connect(url, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
        })
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));
    } else {
      await mongoose
        .connect(url, {
          useNewUrlParser: true,
          useCreateIndex: true,
          useFindAndModify: false,
          useUnifiedTopology: true,
        })
        .then(() => console.log('MongoDB Connected'))
        .catch((err) => console.log(err));
    }
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
