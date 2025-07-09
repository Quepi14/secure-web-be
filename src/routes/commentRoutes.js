const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const { getComments, comment, updateComment } = require('../controllers/authController');
const upload = require('../utils/multerConfig');

router.get('/', getComments);
router.post('/', verifyToken, upload.single('image'), comment);
router.put('/:id', verifyToken, updateComment);

module.exports = router;
