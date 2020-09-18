const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30).required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required()
});

module.exports = userSchema;