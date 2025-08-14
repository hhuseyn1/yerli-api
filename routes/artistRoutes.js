const express = require('express');
const router = express.Router();

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
} = require('../middlewares/validation');

router.post('/', validateArtist, createArtist);
router.get('/', getAllArtists);
router.get('/:id', validateObjectId, getArtistById);
router.put('/:id', validateObjectId, validateArtist, updateArtist);
router.delete('/:id', validateObjectId, deleteArtist);

router.get('/search', searchArtists);

module.exports = router;