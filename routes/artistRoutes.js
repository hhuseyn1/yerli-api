const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth_middleware');

const {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  searchArtists
} = require('../controllers/artistController');

const {
  validateArtist,
  validateObjectId
} = require('../middlewares/validation_middleware');

router.post('/', protect, validateArtist, createArtist);
router.get('/', getAllArtists);
router.get('/:id', validateObjectId, getArtistById);
router.put('/:id', protect, validateObjectId, validateArtist, updateArtist);
router.delete('/:id', protect, validateObjectId, deleteArtist);

router.get('/search', searchArtists);

module.exports = router;