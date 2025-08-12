const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { validateProject, validateObjectId } = require('../middlewares/validation');

router.post('/', validateProject, projectController.createProject);
router.get('/', projectController.getAllProjects);
router.get('/search', projectController.searchProjects);
router.get('/category/:category', projectController.getProjectsByCategory);
router.get('/:id', validateObjectId, projectController.getProjectById);
router.put('/:id', validateObjectId, validateProject, projectController.updateProject);
router.delete('/:id', validateObjectId, projectController.deleteProject);

module.exports = router;