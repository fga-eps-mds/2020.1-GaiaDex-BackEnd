require('dotenv').config();
const config = require('./config')
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const itemRoutes = require('./routes/itemRoutes');

// MongoDB connection


mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost:27017/noderest', {useNewUrlParser : true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
app.use('/item',itemRoutes);


require('./routes/plantRoutes')(app);
require('./routes/topicRoutes')(app);
require('./routes/commentRoutes')(app);



// starting the server
app.listen(config.app.port, (err) => {
    if (err)
        console.log('Erro')

    console.log(`Server on port ${config.app.port}`);
});