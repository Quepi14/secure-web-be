const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secure-web';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if( !authHeader || !authHeader.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`[verifyToken] Decoded:`, decoded);
    req.user = decoded;
    next();
}catch (err) {
  return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
}

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

module.exports = {
  verifyToken,
  authorizeRole
};