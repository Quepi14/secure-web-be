const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../utils/config');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Hanya admin yang diizinkan' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};
