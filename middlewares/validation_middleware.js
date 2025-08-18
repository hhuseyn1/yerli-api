const Joi = require('joi');
const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Bad Request' });
  }
  next();
};

const artistSchema = Joi.object({
  name: Joi.string().min(2).required(),
  photoUrl: Joi.string().uri().pattern(/\.(jpg|jpeg|png|gif|webp)$/i).required(),
  smartLink: Joi.string().uri().required()
});

const projectSchema = Joi.object({
  title: Joi.string().min(3).required(),
  coverPhoto: Joi.string().uri().pattern(/\.(jpg|jpeg|png|gif|webp)$/i).required(),
  datetime: Joi.date().iso().required(),
  category: Joi.string().valid('concert', 'festival', 'album', 'single').required(),
  tags: Joi.array().items(Joi.string()).min(1).required(),
  image_urls: Joi.array().items(
    Joi.string().uri().pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
  ).length(5).required(),
  description: Joi.string().min(10).required(),
  artist: Joi.string().custom((value, helpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  }).required()
});

const validateArtist = (req, res, next) => {
  const { error } = artistSchema.validate(req.body);
  if (error) return res.status(400).json({ message: 'Bad Request' });
  next();
};

const validateProject = (req, res, next) => {
  const { error } = projectSchema.validate(req.body);
  if (error) return res.status(400).json({ message: 'Bad Request' });
  next();
};

module.exports = {
  validateObjectId,
  validateArtist,
  validateProject
};
