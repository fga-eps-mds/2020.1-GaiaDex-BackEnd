const express = require('express');
const authRoutes = require('./routes/authRoutes');

const routes = new express.Router();

// const plantRoutes = require('./routes/plantRoutes');
// const topicRoutes = require('./routes/topicRoutes');
// const commentRoutes = require('./routes/commentRoutes');

routes.use('/auth', authRoutes);
// app.use('/plant', plantRoutes);
// app.use('/topic', topicRoutes);
// app.use('/comment', commentRoutes);

module.exports = routes;
