const mongoose = require('mongoose');

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
