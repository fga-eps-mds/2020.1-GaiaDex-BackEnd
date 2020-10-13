const Joi = require('joi');

const topicSchema = Joi.object({
    title: Joi.string().min(4).max(30).required(),
    description: Joi.string().min(5)
});

module.exports = topicSchema;
