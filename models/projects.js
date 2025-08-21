const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending'
  },
  category: {
    type: String,
    trim: true
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }
}, {
  timestamps: true
});

projectSchema.index({ name: 'text', description: 'text' });
projectSchema.index({ category: 1 });
projectSchema.index({ artistId: 1 });

module.exports = mongoose.model('Project', projectSchema);