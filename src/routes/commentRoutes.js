const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/verifyToken');
const { getComments, comment, updateComment } = require('../controllers/authController');

router.get('/', getComments);
router.post('/', verifyToken, comment);
router.put('/:id', verifyToken, updateComment);

module.exports = router;
