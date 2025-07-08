require('dotenv').config();
const jwt = require('jsonwebtoken');


const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak - Hanya untuk role: ${roles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = { authorizeRole };
