const express = require('express');
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const topicRoutes = require('./routes/topicRoutes');

const routes = new express.Router();


// const commentRoutes = require('./routes/commentRoutes');

routes.use('/auth', authRoutes);
routes.use('/plant', plantRoutes);
routes.use('/topic', topicRoutes);
// app.use('/comment', commentRoutes);

module.exports = routes;
