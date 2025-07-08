// routes/admin.js
const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const {
  getAllComments,
  updateComment,
  deleteComment
} = require('../controllers/adminCommentController');

router.use(adminAuth);

router.get('/', getAllComments);
router.put('/:id', updateComment);
router.delete(':id', deleteComment);

module.exports = router;
