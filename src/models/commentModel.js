const db = require('../db');
const { get } = require('../routes/adminRoutes');

// menginputkan komentar baru
const insertComment = (userId, comment, image) => {
  return new Promise((resolve, reject) => {

    if(!userId || !comment) {
      return reject (new Error('userId dan comment wajib diisi'))
    }
    db.run(
      `INSERT INTO comments (user_id, comment, image) VALUES (?, ?, ?)`,
      [userId, comment, image],
      function (err) {
        if (err) {
          console.error('Insert comment error:', err);
          return reject(err);
        }
        resolve(this.lastID);
      }
    );
  });
};

//// Ambil semua komentar
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

//ambil komentar berdasarkan ID
const getCommentById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM comments WHERE id = ?`, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row); 
    });
  });
};


// Update komentar berdasarkan ID
const updateCommentById = (id, comment, image) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE comments SET comment = ?, image = ? WHERE id = ?`,
      [comment, image, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes); 
      }
    );
  });
};

// Hapus komentar berdasarkan ID
const deleteCommentById = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM comments WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes); 
    });
  });
};



module.exports = {
  insertComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteCommentById
};
