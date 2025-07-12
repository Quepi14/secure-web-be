const db = require('../models/db');

// Ambil semua komentar
const getAllComments = (req, res) => {
  const sql = `
    SELECT c.id, c.user_id, c.comment, c.image, c.created_at, u.username
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    ORDER BY c.created_at DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error getAllComments:', err);
      return res.status(500).json({ success: false, message: 'Gagal mengambil komentar' });
    }

    const result = rows.map(c => ({
      id: c.id,
      user_id: c.user_id,
      username: c.username || 'unknown',
      comment: c.comment,
      image: c.image,
      created_at: c.created_at
    }));

    res.json({ success: true, data: result });
  });
};

// Hapus komentar oleh admin
const deleteComment = (req, res) => {
  const { id } = req.params;
  const admin = req.user;

  db.get('SELECT * FROM comments WHERE id = ?', [id], (err, foundComment) => {
    if (err || !foundComment) {
      return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan' });
    }

    db.run('DELETE FROM comments WHERE id = ?', [id], function (err2) {
      if (err2) {
        console.error('Delete Comment Error:', err2);
        return res.status(500).json({ success: false, message: 'Gagal menghapus komentar' });
      }

      const logSql = `
        INSERT INTO log (action, user_id, username, target_com, description, created_at)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
      `;

      const logParams = [
        'DELETE_COMMENT',
        admin.id,
        admin.username,
        foundComment.id,
        `Admin ${admin.username} menghapus komentar ID ${id}`
      ];

      db.run(logSql, logParams, (err3) => {
        if (err3) {
          console.error('Log Error:', err3);
          return res.status(500).json({ success: false, message: 'Komentar terhapus, tetapi gagal mencatat log' });
        }

        res.json({ success: true, message: 'Komentar berhasil dihapus' });
      });
    });
  });
};

module.exports = {
  getAllComments,
  deleteComment
};
