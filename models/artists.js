const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  photoUrl: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Photo URL must be a valid URL'
    }
  },
  smartLink: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Smart link must be a valid URL'
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
artistSchema.index({ name: 'text' });

module.exports = mongoose.model('Artist', artistSchema);
