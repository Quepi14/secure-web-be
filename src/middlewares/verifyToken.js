const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secure-web';

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader?.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
}catch (err) {
  return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
}