const express = require('express');
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const scannerRoutes = require('./routes/scannerRoutes');
// const scannerRoutes = require('./routes/scanner');
const topicRoutes = require('./routes/topicRoutes');
const commentRoutes = require('./routes/commentRoutes');
const myPlantRoutes = require('./routes/myPlantRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const collectionRoutes = require('./routes/collectionRoutes');

const routes = new express.Router();

routes.use('/auth', authRoutes);
routes.use('/plant', plantRoutes);
routes.use('/topic', topicRoutes);
routes.use('/comment', commentRoutes);
routes.use('/myplants', myPlantRoutes);
routes.use('/favorites', favoriteRoutes);
routes.use('/collection', collectionRoutes);
routes.use('/scanner', scannerRoutes);

module.exports = routes;
