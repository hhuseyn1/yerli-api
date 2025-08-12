const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  next();
};

const validateArtist = (req, res, next) => {
  const { name, photoUrl, smartLink } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  if (!photoUrl || !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(photoUrl)) {
    errors.push('Valid photo URL is required');
  }
  if (!smartLink || !/^https?:\/\/.+/.test(smartLink)) {
    errors.push('Valid smart link is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  next();
};

const validateProject = (req, res, next) => {
  const { title, coverPhoto, datetime, category, tags, image_urls, description, artist } = req.body;
  const errors = [];
  const validCategories = ['concert', 'festival', 'album', 'single'];

  if (!title || title.trim().length < 3) {
    errors.push('Title is required and must be at least 3 characters');
  }
  if (!coverPhoto || !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(coverPhoto)) {
    errors.push('Valid cover photo URL is required');
  }
  if (!datetime || new Date(datetime).toString() === 'Invalid Date') {
    errors.push('Valid datetime is required');
  }
  if (!category || !validCategories.includes(category)) {
    errors.push(`Category must be one of: ${validCategories.join(', ')}`);
  }
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    errors.push('At least one tag is required');
  }
  if (!image_urls || !Array.isArray(image_urls) || image_urls.length !== 5) {
    errors.push('Exactly 5 image URLs are required');
  } else {
    const invalidUrls = image_urls.filter(url => !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url));
    if (invalidUrls.length > 0) {
      errors.push('All image_urls must be valid image URLs');
    }
  }
  if (!description || description.trim().length < 10) {
    errors.push('Description is required and must be at least 10 characters');
  }
  if (!artist || !mongoose.Types.ObjectId.isValid(artist)) {
    errors.push('Valid artist ID is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  next();
};

module.exports = {
  validateObjectId,
  validateArtist,
  validateProject
};