const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secure-web';

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Tidak ada token, akses ditolak' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};