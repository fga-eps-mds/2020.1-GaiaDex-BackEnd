require('dotenv').config();
const config = require('./config')
const express = require('express');
const app = express();
const morgan = require('morgan');

// settings
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
app.use(require('./routes/index.js'));

// starting the server
app.listen(config.app.port, (err) => {
    if (err)
        console.log('Erro')

    console.log(`Server on port ${config.app.port}`);
});