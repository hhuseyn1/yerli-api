const Project = require('../models/projects');
const Artist = require('../models/artists');

const createProject = async (projectData) => {
  try {
    const artist = await Artist.findOne({ _id: projectData.artist, isActive: true });
    if (!artist) throw new Error('Artist not found');

    const project = new Project(projectData);
    return await project.save();
  } catch (error) {
    throw new Error(`Error creating project: ${error.message}`);
  }
};

const getAllProjects = async (options = {}) => {
  try {
    const { page = 1, limit = 10, category, artistId, isActive = true } = options;
    const skip = (page - 1) * limit;

    const filter = { isActive };
    if (category) filter.category = category;
    if (artistId) filter.artist = artistId;

    const projects = await Project.find(filter)
      .populate('artist', 'ad photoUrl smartLink')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ datetime: -1 });

    const total = await Project.countDocuments(filter);

    return {
      projects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(`Error fetching projects: ${error.message}`);
  }
};

const getProjectById = async (id) => {
  try {
    const project = await Project.findOne({ _id: id, isActive: true })
      .populate('artist', 'ad photoUrl smartLink');
    if (!project) throw new Error('Project not found');
    return project;
  } catch (error) {
    throw new Error(`Error fetching project: ${error.message}`);
  }
};

const updateProject = async (id, updateData) => {
  try {
    if (updateData.artist) {
      const artist = await Artist.findOne({ _id: updateData.artist, isActive: true });
      if (!artist) throw new Error('Artist not found');
    }

    const project = await Project.findOneAndUpdate(
      { _id: id, isActive: true },
      updateData,
      { new: true, runValidators: true }
    ).populate('artist', 'ad photoUrl smartLink');

    if (!project) throw new Error('Project not found');
    return project;
  } catch (error) {
    throw new Error(`Error updating project: ${error.message}`);
  }
};

const deleteProject = async (id) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );
    if (!project) throw new Error('Project not found');
    return project;
  } catch (error) {
    throw new Error(`Error deleting project: ${error.message}`);
  }
};

const getProjectsByCategory = async (category) => {
  try {
    return await Project.find({ category, isActive: true })
      .populate('artist', 'ad photoUrl smartLink')
      .sort({ datetime: -1 });
  } catch (error) {
    throw new Error(`Error fetching projects by category: ${error.message}`);
  }
};

const searchProjects = async (searchTerm) => {
  try {
    const projects = await Project.find({
      isActive: true,
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    })
      .populate('artist', 'ad photoUrl smartLink')
      .sort({ datetime: -1 });
    return projects;
  } catch (error) {
    throw new Error(`Error searching projects: ${error.message}`);
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
