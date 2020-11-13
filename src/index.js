const express = require('express');

const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const topicRoutes = require('./routes/topicRoutes');
const commentRoutes = require('./routes/commentRoutes');
const myPlantRoutes = require('./routes/myPlantRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// MongoDB connection
// mongodb://localhost:27017/noderest  => meu banco de dados local polupado
// mongodb://mongo:27017/backend => banco de dados da develop
mongoose
  .connect('mongodb://mongo:27017/backend', { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes

app.use('/auth', authRoutes);
app.use('/plant', plantRoutes);
app.use('/topic', topicRoutes);
app.use('/comment', commentRoutes);
app.use('/myplants', myPlantRoutes);
app.use('/favorite', favoriteRoutes);

// starting the server
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});
