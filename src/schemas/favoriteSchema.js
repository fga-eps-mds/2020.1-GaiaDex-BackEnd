const Joi = require('joi');

const favoriteSchema = Joi.object({
    nickname: Joi.string().min(4).max(30).required(),
});

module.exports = favoriteSchema;
