const db = require('./db'); // pastikan file db.js sudah terhubung dengan sqlite3

const insertComment = (user_id, comment, image) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO comments (user_id, comment, image, created_at) VALUES (?, ?, ?, datetime('now'))`,
      [user_id, comment, image],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const getAllComments = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT comments.*, users.username 
       FROM comments 
       JOIN users ON comments.user_id = users.id 
       ORDER BY comments.created_at DESC`,
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const updateComment = (id, user_id, comment, image) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE comments SET comment = ?, image = ? WHERE id = ? AND user_id = ?`,
      [comment, image, id, user_id],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

const deleteComment = (id, user_id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM comments WHERE id = ? AND user_id = ?`,
      [id, user_id],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

const getCommentById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM comments WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

module.exports = {
  insertComment,
  getAllComments,
  updateComment,
  deleteComment,
  getCommentById
};