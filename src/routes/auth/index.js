const express = require('express');
const Joi = require('Joi');

const router = express.Router();

const schema = Joi.object({
    username: Joi.string().alphanum().min(4).max(20).required(),
    password: Joi.string().alphanum().min(8).required()
});

// Every route ir is preceded by /auth

router.get('/', (req, res) => {
    res.json({
        message: 'Authentication!'
    });
});

router.post('/signup', (req, res) => {
    const result = schema.validate(req.body);

    if(result.error) {
        console.log(result.error);
        next(result.error);
    } else {

    }

});

module.exports = router;