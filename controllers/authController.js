const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const createToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !(await admin.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = createToken(admin._id);
  res.json({ token });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;
  const existing = await Admin.findOne({ email });
  if (existing) return res.status(400).json({ message: 'Admin exists' });

  const admin = await Admin.create({ email, password });
  const token = createToken(admin._id);
  res.status(201).json({ token });
};

