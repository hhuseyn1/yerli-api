const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  coverPhoto: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Cover photo must be a valid URL'
    }
  },
  datetime: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: {
      values: ['concert', 'festival', 'album', 'single'],
      message: 'Category must be one of: concert, festival, album, single'
    }
  },
  tags: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one tag is required'
    }
  },
  image_urls: {
    type: [String],
    required: true,
    validate: [
      {
        validator: function(v) {
          return v && v.length === 5;
        },
        message: 'Exactly 5 images are required'
      },
      {
        validator: function(v) {
          return v.every(url => /^https?:\/\/.+/.test(url));
        },
        message: 'All image URLs must be valid URLs'
      }
    ]
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
