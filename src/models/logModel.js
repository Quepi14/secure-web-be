const db = require('../db');

const insertLog = (action, adminId, adminUsername, targetCommentId, description) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO logs (action, adminId, adminUsername, targetCommentId, description)
       VALUES (?, ?, ?, ?, ?)`,
      [action, adminId, adminUsername, targetCommentId, description],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const getLogs = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM logs ORDER BY created_at DESC`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = {
  insertLog,
  getLogs
};
