const express = require('express');
const volleyball = require('volleyball');
const mongoose = require('mongoose');
const auth = require('./routes/auth');

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
app.use(volleyball);
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// routes
app.use('/item',itemRoutes);
app.use(require('./routes'));
app.use('/auth', auth);

// error handlers
function notFound(req, res, next) {
    res.status(404);
    const error = new Error('Not Found - ' + req.originalUrl);
    next(error);
}

function errorHandler(err, req, res, next) {
    res.status(res.statusCode || 500);
    res.json({
        message: err.messege,
        stack: err.stack
    });
}

app.use(notFound);
app.use(errorHandler);

// starting the server

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // The server only starts when the mongoose connects to the database.
        app.listen(app.get('port'), () => {
            console.log(`Server on port ${app.get('port')}`);
        });
    })
    .catch(err => console.log(err));
