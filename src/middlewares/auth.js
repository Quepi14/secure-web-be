const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;


const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'ACCESS DENIED - Token tidak ditemukan'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau sudah kedaluwarsa'
    });
  }
};


const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: 'Pengguna belum diautentikasi'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak - Hanya untuk role: ${roles.join(', ')}`
      });
    }

    next();
  };
};

module.exports = { verifyToken, authorizeRole };
