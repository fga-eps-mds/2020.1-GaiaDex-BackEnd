const express = require('express');

const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const topicRoutes = require('./routes/topicRoutes');
const commentRoutes = require('./routes/commentRoutes');
const myPlantRoutes = require('./routes/myPlantRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const scanner = require('./routes/scanner');

// MongoDB connection
// mongodb://localhost:27017/noderest  => meu banco de dados local polupado
// mongodb://mongo:27017/backend => banco de dados da develop
console.log(`db host ${process.env.DB_HOST}`);
console.log(`db host ${process.env.DB_PORT}`);
console.log(`db host ${process.env.DB_NAME}`);
console.log(
  `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
);
mongoose
  .connect(
    `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    // `mongodb://mongo:27017/backend`,
    {
      authSource: 'admin',
      user: process.env.MONGO_INITDB_ROOT_USERNAME,
      password: process.env.MONGO_INITDB_ROOT_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));
// middlewares
app.use(express.json({ limit: 20 * 1024 * 1024 }));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes

app.use('/auth', authRoutes);
app.use('/plant', plantRoutes);
app.use('/topic', topicRoutes);
app.use('/comment', commentRoutes);
app.use('/myplants', myPlantRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/collection', collectionRoutes);
app.use('/scanner', scanner);

// starting the server
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
