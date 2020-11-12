const express = require('express');
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const topicRoutes = require('./routes/topicRoutes');
const commentRoutes = require('./routes/commentRoutes');

const routes = new express.Router();

routes.use('/auth', authRoutes);
routes.use('/plant', plantRoutes);
routes.use('/topic', topicRoutes);
routes.use('/comment', commentRoutes);

module.exports = routes;
