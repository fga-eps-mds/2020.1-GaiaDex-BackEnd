const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().alphanum().min(4).max(30).required(),
  password: Joi.string().min(8).required(),
  passwordConfirmation: Joi.string()
    .min(8)
    .required()
    .valid(Joi.ref('password'))
    .error(new Error('Password confirmation does not match.')),
  email: Joi.string().email().required(),
  photo: Joi.string().min(4).max(300),
});

module.exports = userSchema;
