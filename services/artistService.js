const Artist = require('../models/artists');

const createArtist = async (artistData) => {
  try {
    const artist = new Artist(artistData);
    return await artist.save();
  } catch (error) {
    throw new Error(`Error creating artist: ${error.message}`);
  }
};

const getAllArtists = async (options = {}) => {
  try {
    const { page = 1, limit = 10, isActive = true } = options;
    const skip = (page - 1) * limit;

    const artists = await Artist.find({ isActive })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Artist.countDocuments({ isActive });

    return {
      artists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(`Error fetching artists: ${error.message}`);
  }
};

const getArtistById = async (id) => {
  try {
    const artist = await Artist.findOne({ _id: id, isActive: true });
    if (!artist) throw new Error('Artist not found');
    return artist;
  } catch (error) {
    throw new Error(`Error fetching artist: ${error.message}`);
  }
};

const updateArtist = async (id, updateData) => {
  try {
    const artist = await Artist.findOneAndUpdate(
      { _id: id, isActive: true },
      updateData,
      { new: true, runValidators: true }
    );
    if (!artist) throw new Error('Artist not found');
    return artist;
  } catch (error) {
    throw new Error(`Error updating artist: ${error.message}`);
  }
};

const deleteArtist = async (id) => {
  try {
    const artist = await Artist.findOneAndUpdate(
      { _id: id, isActive: true },
      { isActive: false },
      { new: true }
    );
    if (!artist) throw new Error('Artist not found');
    return artist;
  } catch (error) {
    throw new Error(`Error deleting artist: ${error.message}`);
  }
};

const searchArtists = async (searchTerm) => {
  try {
    const artists = await Artist.find({
      isActive: true,
      ad: { $regex: searchTerm, $options: 'i' }
    }).sort({ createdAt: -1 });
    return artists;
  } catch (error) {
    throw new Error(`Error searching artists: ${error.message}`);
  }
};

module.exports = {
  createArtist,
  getAllArtists,
  getArtistById,
  updateArtist,
  deleteArtist,
  searchArtists
};
