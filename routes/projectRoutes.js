const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth_middleware');

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
} = require('../middlewares/validation_middleware');

router.post('/', protect, validateProject, createProject);
router.get('/', getAllProjects);
router.get('/:id', validateObjectId, getProjectById);
router.put('/:id', protect, validateObjectId, validateProject, updateProject);
router.delete('/:id', protect, validateObjectId, deleteProject);

router.get('/search', searchProjects);
router.get('/category/:category', getProjectsByCategory);

module.exports = router;
