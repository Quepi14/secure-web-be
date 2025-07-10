const db = require('../db');

const insertLog = (action, userId, username, targetCommentId, description) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO log (action, user_id, username, target_com, description)
       VALUES (?, ?, ?, ?, ?)`,
      [action, userId, username, targetCommentId, description],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const getLogs = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM log ORDER BY created_at DESC`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = {
  insertLog,
  getLogs
};
