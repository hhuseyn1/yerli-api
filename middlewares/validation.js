const Joi = require('joi');

const schemas = {
  adminRegister: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),

  adminLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  artist: Joi.object({
    name: Joi.string().trim().required(),
    photoUrl: Joi.string().pattern(/^https?:\/\/.+/).required()
      .messages({ 'string.pattern.base': 'Photo URL must be a valid URL' }),
    smartLink: Joi.string().pattern(/^https?:\/\/.+/).required()
      .messages({ 'string.pattern.base': 'Smart link must be a valid URL' })
  }),

  project: Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().required()
      .messages({ 'string.email': 'Please enter a valid email address' }),
    description: Joi.string().trim().required(),
    status: Joi.string().valid('pending', 'reviewed', 'approved', 'rejected').optional()
  }),

  emailRequest: Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().required()
      .messages({ 'string.email': 'Please provide a valid email address' }),
    description: Joi.string().trim().required()
  })
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }
    next();
  };
};

module.exports = { schemas, validate };