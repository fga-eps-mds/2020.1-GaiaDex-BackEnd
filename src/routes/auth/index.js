const express = require('express');
const Joi = require('joi');

const router = express.Router();
const User = require('../../db/user');

const schema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required(),
    password: Joi.string().min(8).required()
});

router.get('/', (req, res) => {
    res.json({
        message: 'Authentication!'
    });
});

router.post('/signup', (req, res, next) => {
    // This validation returns null if there is no errors
    const result = schema.validate(req.body);

    if(result.error) {
        // if there is an error we throw it to the errorHandler
        console.log(result.error);
        next(result.error);
    } else {
        // Looking for a user with same username that is being received in the req
        User.findOne({
            username: req.body.username
        }).then(user => { 
            if( user ) {
                const error = new Error(user.username + ' username is already being used.');
                next(error);
            } else {
                const user = new User({
                    username: req.body.username,
                    password: req.body.password
                });

                user.save()
                    .then( result => {
                        res.send(result);
                    })
                    .catch(err => console.log(err));
            }
        })
    }
});

module.exports = router;
