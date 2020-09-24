const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const itemRoutes = require('./routes/itemRoutes');
const authRoutes = require('./routes/authRoutes');

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
app.use('/auth',authRoutes);

// starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
