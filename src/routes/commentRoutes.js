const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const { verifyToken } = require('../middlewares/verifyToken');
const {
  getComment,
  submitComment,
  updateComment,
  deleteComment
} = require('../controllers/authController');

router.get('/', verifyToken, getComment);
router.post('/', verifyToken, upload.single('image'), submitComment);
router.put('/:id', verifyToken, upload.single('image'), updateComment);
router.delete('/:id', verifyToken, deleteComment);

module.exports = router;
