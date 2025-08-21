const mongoose = require('mongoose');
const Project = require('../models/projects');

const projectController = {
  create: async (req, res) => {
    try {
      const project = new Project(req.body);
      await project.save();
      
      res.status(201).json({ 
        success: true, 
        data: project 
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
      const { category, artistId } = req.query;

      let filter = {};
      if (category) filter.category = category;
      if (artistId && mongoose.Types.ObjectId.isValid(artistId)) {
        filter.artistId = artistId;
      }

      const total = await Project.countDocuments(filter);
      const projects = await Project.find(filter)
        .populate('artistId', 'name photoUrl')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const pages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: projects,
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

      const project = await Project.findById(req.params.id)
        .populate('artistId', 'name photoUrl smartLink');
      
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
      }

      const project = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('artistId', 'name photoUrl');

      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }

      res.json({ success: true, data: project });
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

      const project = await Project.findByIdAndDelete(req.params.id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
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

      const projects = await Project.find({
        $text: { $search: q }
      }).populate('artistId', 'name photoUrl').limit(20);

      res.json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  getByCategory: async (req, res) => {
    try {
      const { category } = req.params;
      
      const projects = await Project.find({ category })
        .populate('artistId', 'name photoUrl')
        .sort({ createdAt: -1 });

      res.json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};

module.exports = projectController;