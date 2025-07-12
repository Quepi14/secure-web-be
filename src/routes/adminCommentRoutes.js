const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRole } = require('../middlewares/verifyToken');
const { getAllComments, deleteComment } = require('../controllers/adminCommentController');

// Middleware: hanya admin yang boleh
router.use(verifyToken, authorizeRole(['admin']));

// GET semua komentar
router.get('/', getAllComments);

// DELETE komentar by ID
router.delete('/:id', deleteComment);

module.exports = router;
