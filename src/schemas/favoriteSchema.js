const Joi = require('joi');

const favoriteSchema = Joi.object({
    nickname: Joi.string().alphanum().min(2).max(20).required(),
});

module.exports = favoriteSchema;
