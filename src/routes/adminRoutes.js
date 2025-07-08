const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorizeRole } = require('../middlewares/auth');

router.use((req, res, next) => {
  console.log(`ADMIN: ${req.method} ${req.originalUrl}`);
  next();
});

router.post('/login', adminController.login);
router.get('/verify', verifyToken, authorizeRole(['admin']), adminController.verify);
router.get('/check', verifyToken, adminController.checkLogin);
router.get('/dashboard', verifyToken, authorizeRole(['admin']), adminController.dashboard);
router.get('/users', verifyToken, authorizeRole(['admin']), adminController.listUsers);
router.post('/logout', adminController.logout);

module.exports = router;
