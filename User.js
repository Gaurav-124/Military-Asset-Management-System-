const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).populate('assignedBase');
    if (!req.user || !req.user.isActive) {
      return res.status(401).json({ success: false, message: 'User not found or inactive' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// Role authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this resource`
      });
    }
    next();
  };
};

// Base access control: base_commander can only see their own base
const baseAccess = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  if (req.user.role === 'base_commander' && req.user.assignedBase) {
    req.baseFilter = req.user.assignedBase._id;
  }
  if (req.user.role === 'logistics_officer') {
    // logistics officer sees all bases but limited operations
    req.baseFilter = null;
  }
  next();
};

module.exports = { protect, authorize, baseAccess };
