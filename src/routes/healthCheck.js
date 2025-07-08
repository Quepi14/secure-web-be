const express = require('express');
const router = express.Router();
const db = require('../db'); 


router.get('/health', (req, res) => {
  if (!db) {
    return res.status(500).json({ status: 'error', message: 'DB not initialized' });
  }

  db.get('SELECT 1', [], (err) => {
    if (err) {
      return res.status(500).json({ status: 'error', message: 'Database error', error: err.message });
    }

    res.status(200).json({ status: 'ok', message: 'Service & DB healthy' });
  });
});

//tes endpoint cookie

router.get('/test-cookie', (req, res) => {
  res.cookie('token', 'dummy', { httpOnly:  true, secure: false})
  res.json({ message: 'cookie sent'})
})

module.exports = router;