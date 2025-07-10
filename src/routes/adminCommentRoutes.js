const express = require('express');
const router = express.Router();
const {verifyToken, authorizeRole } = require('../middlewares/verifyToken')
const {
  getAllComments,
  deleteComment
} = require('../controllers/adminCommentController');

router.use(verifyToken, authorizeRole(['admin']));

router.get('/', getAllComments);
router.delete('/:id', deleteComment);

module.exports = router;
