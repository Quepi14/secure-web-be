const express = require('express');
const router = express.Router();
const db = require('../models/db'); 


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
router.get('/test-token', (req, res) => {
  const dummyPayload = {
    id: 999,
    username: 'dummyuser',
    role: 'admin',
}

  const token = jwt.sign(dummyPayload, JWT_SECRET, { expiresIn: '1h' });

  res.json ({ message: 'Beaer token terkirim', token})
})


module.exports = router;