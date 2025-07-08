const db = require('../db');

const insertComment = (userId, comment, image) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO comments (user_id, comment, image) VALUES (?, ?, ?)`,
      [userId, comment, image],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const getAllComments = () => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT c.id, c.user_id, u.username, c.comment, c.image, c.created_at 
       FROM comments c 
       JOIN users u ON c.user_id = u.id 
       ORDER BY c.created_at DESC`,
      [],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};

const updateCommentById = (id, username, comment, image) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE comments SET username = ?, comment = ?, image = ? WHERE id = ?`,
      [username, comment, image, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes); 
      }
    );
  });
};

const deleteComment = (id) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM comments WHERE id = ?`,
      [id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes); 
      }
    );
  });
};

module.exports = {
  insertComment,
  getAllComments,
  updateCommentById,
  deleteComment
};
