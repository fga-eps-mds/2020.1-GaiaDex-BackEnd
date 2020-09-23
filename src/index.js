const express = require('express');
const auth = require('./routes/authRoutes');
const mongoose = require('mongoose');

const app = express();
const morgan = require('morgan');

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
app.use('/auth', auth);

// Error Handlers
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
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
