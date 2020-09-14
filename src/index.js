require('dotenv').config();
const config = require('./config')
const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const itemRoutes = require('./routes/itemRoutes');

// MongoDB connection
mongoose
    .connect(
        'mongodb://mongo:27017/backend',
        { useNewUrlParser: true }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
app.use('/item',itemRoutes);


//Controller
require('./controller/plantController')(app);
require('./controller/commentController')(app);
require('./controller/topicController')(app);



// starting the server
app.listen(config.app.port, (err) => {
    if (err)
        console.log('Erro')

    console.log(`Server on port ${config.app.port}`);
});