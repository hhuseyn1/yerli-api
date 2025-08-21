const mongoose = require('mongoose');
const Artist = require('../models/artists');

const artistController = {
  create: async (req, res) => {
    try {
      const artist = new Artist(req.body);
      await artist.save();
      
      res.status(201).json({ 
        success: true, 
        data: artist 
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const message = Object.values(error.errors)[0].message;
        return res.status(400).json({ success: false, message });
      }
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getAll: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const total = await Artist.countDocuments();
      const artists = await Artist.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const pages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: artists,
        pagination: { page, limit, total, pages }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getById: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
      }

      const artist = await Artist.findById(req.params.id);
      if (!artist) {
        return res.status(404).json({ success: false, message: 'Artist not found' });
      }

      res.json({ success: true, data: artist });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
      }

      const artist = await Artist.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!artist) {
        return res.status(404).json({ success: false, message: 'Artist not found' });
      }

      res.json({ success: true, data: artist });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const message = Object.values(error.errors)[0].message;
        return res.status(400).json({ success: false, message });
      }
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  delete: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
      }

      const artist = await Artist.findByIdAndDelete(req.params.id);
      if (!artist) {
        return res.status(404).json({ success: false, message: 'Artist not found' });
      }

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  search: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ success: false, message: 'Search query is required' });
      }

      const artists = await Artist.find({
        $text: { $search: q }
      }).limit(20);

      res.json({ success: true, data: artists });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

module.exports = artistController;