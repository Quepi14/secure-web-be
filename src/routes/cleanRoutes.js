const express = require('express');
const router = express.Router();
const { user, comment, log } = require('../models/db');

router.post('/clear-all', async (req, res) => {
  try {
    await log.destroy({ where: {}, truncate: true });
    await comment.destroy({ where: {}, truncate: true });
    await user.destroy({ where: {}, truncate: true });
    res.json({ success: true, message: 'Semua data dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
