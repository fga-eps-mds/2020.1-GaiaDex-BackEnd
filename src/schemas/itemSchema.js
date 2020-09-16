const Joi = require('joi');

module.exports = ItemSchema = Joi.object({
    name: Joi.string().min(4).max(30).required(),
    email: Joi.string().email().required(),
})