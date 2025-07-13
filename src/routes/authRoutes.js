const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/verifyToken');

// Jika ingin routing comment dipisah
const commentRoutes = require('./commentRoutes'); 

// Logging
router.use((req, res, next) => {
  console.log(`AUTH: ${req.method} ${req.originalUrl}`);
  next();
});

// Route Register & Login
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check', verifyToken, authController.checkLogin);
router.post('/check-user', authController.checkUser);
router.post('/logout', authController.logout);

// Sub-route ke /secure-app/comments handled in commentRoutes
router.use('/comments', commentRoutes);

module.exports = router;
