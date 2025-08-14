const projectService = require('../services/projectService');

const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const { page, limit, category, artistId } = req.query;
    const result = await projectService.getAllProjects({ page, limit, category, artistId });

    res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      data: result.projects,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Project fetched successfully',
      data: project
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    await projectService.deleteProject(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

const getProjectsByCategory = async (req, res) => {
  try {
    const projects = await projectService.getProjectsByCategory(req.params.category);
    res.status(200).json({
      success: true,
      message: 'Projects by category fetched successfully',
      data: projects
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const searchProjects = async (req, res) => {
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
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getProjectsByCategory,
  searchProjects
};
