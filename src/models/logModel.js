const db = require('./db');

// Insert log baru
const insertLog = (action, user_id, username, target_com, description) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO log (action, user_id, username, target_com, description, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [action, user_id, username, target_com, description],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

// Ambil semua log
const getAllLogs = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM log ORDER BY created_at DESC', [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// (Opsional) Ambil log berdasarkan user
const getLogsByUser = (user_id) => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM log WHERE user_id = ? ORDER BY created_at DESC', [user_id], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  insertLog,
  getAllLogs,
  getLogsByUser
};
