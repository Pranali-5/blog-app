const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { ADMIN_ROLE } = require('../constant/user');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).exec();
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== ADMIN_ROLE) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware }; 