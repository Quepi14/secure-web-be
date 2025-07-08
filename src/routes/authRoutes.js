const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../utils/multerConfig');
const {verifyToken} = require('../middlewares/auth');

router.use((req, res, next) => {
  console.log(`AUTH: ${req.method} ${req.originalUrl}`);
  next();
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/check', verifyToken, authController.checkLogin);
router.post('/check-user', authController.checkUser);
router.post('/logout', authController.logout);
router.post('/comment', verifyToken, upload.single('image'), authController.comment);
router.get('/comments', verifyToken, authController.getComments);


module.exports = router;
