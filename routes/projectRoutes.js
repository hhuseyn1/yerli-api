const express = require('express');
const router = express.Router();

const {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  searchProjects,
  getProjectsByCategory
} = require('../controllers/projectController');

const {
  validateProject,
  validateObjectId
} = require('../middlewares/validation');

router.post('/', validateProject, createProject);
router.get('/', getAllProjects);
router.get('/:id', validateObjectId, getProjectById);
router.put('/:id', validateObjectId, validateProject, updateProject);
router.delete('/:id', validateObjectId, deleteProject);

router.get('/search', searchProjects);
router.get('/category/:category', getProjectsByCategory);

module.exports = router;
