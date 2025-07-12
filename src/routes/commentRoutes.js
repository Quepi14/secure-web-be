const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const { getComment, submitComment, updateComment, deleteComment } = require('../controllers/authController');
const upload = require('../utils/multerConfig');

router.get('/', getComment);
router.post('/', verifyToken, upload.single('image'), submitComment);
router.put('/:id', verifyToken, updateComment);
router.delete('/:id', verifyToken, deleteComment)

module.exports = router;
