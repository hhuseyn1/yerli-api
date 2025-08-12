const artistService = require('../services/artistService');

class ArtistController {
  async createArtist(req, res) {
    try {
      const artist = await artistService.createArtist(req.body);
      res.status(201).json({
        success: true,
        message: 'Artist created successfully',
        data: artist
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllArtists(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await artistService.getAllArtists({ page, limit });
      
      res.status(200).json({
        success: true,
        message: 'Artists fetched successfully',
        data: result.artists,
        pagination: result.pagination
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getArtistById(req, res) {
    try {
      const artist = await artistService.getArtistById(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Artist fetched successfully',
        data: artist
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateArtist(req, res) {
    try {
      const artist = await artistService.updateArtist(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Artist updated successfully',
        data: artist
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteArtist(req, res) {
    try {
      await artistService.deleteArtist(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Artist deleted successfully'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async searchArtists(req, res) {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }
      
      const artists = await artistService.searchArtists(q);
      res.status(200).json({
        success: true,
        message: 'Artists search completed',
        data: artists
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ArtistController();