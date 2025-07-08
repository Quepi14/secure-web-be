const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const {
  getAllComments,
  deleteComment
} = require('../controllers/adminCommentController');

router.use(adminAuth);

router.get('/', getAllComments);
router.delete('/:id', deleteComment);

module.exports = router;
