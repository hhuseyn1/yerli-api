const express = require('express');
const artistController = require('../controllers/artistController');
const authMiddleware = require('../middlewares/auth');
const { schemas, validate } = require('../middlewares/validation');

const router = express.Router();

router.get('/search', artistController.search);
router.post('/', authMiddleware, validate(schemas.artist), artistController.create);
router.get('/', artistController.getAll);
router.get('/:id', artistController.getById);
router.put('/:id', authMiddleware, validate(schemas.artist), artistController.update);
router.delete('/:id', authMiddleware, artistController.delete);

module.exports = router;
