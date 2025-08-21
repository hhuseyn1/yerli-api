const jwt = require('jsonwebtoken');

exports.generateAccessToken = (admin) => {
    return jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: '15m'
    });
};

exports.generateRefreshToken = (admin) => {
    return jwt.sign({ id: admin._id }, process.env.REFRESH_SECRET, {
    expiresIn: '7d'
    });
};