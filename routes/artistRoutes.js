const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');
const { validateArtist, validateObjectId } = require('../middlewares/validation');

router.post('/', validateArtist, artistController.createArtist);
router.get('/', artistController.getAllArtists);
router.get('/search', artistController.searchArtists);
router.get('/:id', validateObjectId, artistController.getArtistById);
router.put('/:id', validateObjectId, validateArtist, artistController.updateArtist);
router.delete('/:id', validateObjectId, artistController.deleteArtist);

module.exports = router;