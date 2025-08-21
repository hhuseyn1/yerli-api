const express = require('express');
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middlewares/auth');
const { schemas, validate } = require('../middlewares/validation');

const router = express.Router();

router.get('/search', projectController.search);
router.get('/category/:category', projectController.getByCategory);
router.post('/', authMiddleware, validate(schemas.project), projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.put('/:id', authMiddleware, validate(schemas.project), projectController.update);
router.delete('/:id', authMiddleware, projectController.delete);

module.exports = router;
