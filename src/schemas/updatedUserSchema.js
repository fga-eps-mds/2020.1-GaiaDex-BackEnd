const Joi = require('Joi');

const updateUserSchema = Joi.object({
    username: Joi.string().alphanum().min(4).max(30),
    password: Joi.string().min(8),
    email: Joi.string().email()
});

module.exports = updateUserSchema;
