require('dotenv').config();
const config = require('./config')
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const itemRoutes = require('./routes/itemRoutes');
const plantRoutes = require('./routes/plantRoutes');
const topicRoutes = require('./routes/topicRoutes');
const commentRoutes = require('./routes/commentRoutes');

// MongoDB connection

//mongodb://localhost:27017/noderest  => meu banco de dados local polupado
//mongodb://mongo:27017/backend => banco de dados da develop
mongoose
    .connect(
        'mongodb://mongo:27017/backend',
        { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
app.use('/item',itemRoutes);
app.use('/plant',plantRoutes);
app.use('/topic',topicRoutes);
app.use('/comment',commentRoutes);



// starting the server
app.listen(config.app.port, (err) => {
    if (err)
        console.log('Erro')

    console.log(`Server on port ${config.app.port}`);
});