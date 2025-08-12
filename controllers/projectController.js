const projectService = require('../services/projectService');

class ProjectController {
  async createProject(req, res) {
    try {
      const project = await projectService.createProject(req.body);
      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        data: project
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllProjects(req, res) {
    try {
      const { page, limit, category, artistId } = req.query;
      const result = await projectService.getAllProjects({ 
        page, 
        limit, 
        category, 
        artistId 
      });
      
      res.status(200).json({
        success: true,
        message: 'Projects fetched successfully',
        data: result.projects,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getProjectById(req, res) {
    try {
      const project = await projectService.getProjectById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Project fetched successfully',
        data: project
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateProject(req, res) {
    try {
      const project = await projectService.updateProject(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Project updated successfully',
        data: project
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteProject(req, res) {
    try {
      await projectService.deleteProject(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getProjectsByCategory(req, res) {
    try {
      const projects = await projectService.getProjectsByCategory(req.params.category);
      res.status(200).json({
        success: true,
        message: 'Projects by category fetched successfully',
        data: projects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async searchProjects(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }
      
      const projects = await projectService.searchProjects(q);
      res.status(200).json({
        success: true,
        message: 'Projects search completed',
        data: projects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ProjectController();