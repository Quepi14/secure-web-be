// File: controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const { jwtSecret } = require('../config/index');

// REGISTER
const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Lengkapi formnya!' });
  }

  try {
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, existing) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal registrasi' });
      if (existing) return res.status(400).json({ success: false, message: 'Username atau email sudah digunakan' });

      const hashedPassword = await bcrypt.hash(password, 10);
      db.run('INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, datetime("now"))',
        [username, email, hashedPassword, 'user'],
        function (err) {
          if (err) return res.status(500).json({ success: false, message: 'Gagal registrasi' });
          res.json({ success: true, message: 'Registrasi berhasil' });
        });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal registrasi' });
  }
};

// LOGIN
const login = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Isi lengkap' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err || !user) return res.status(401).json({ success: false, message: 'Username atau Password salah' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Username atau Password salah' });

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.json({ success: true, message: 'Login berhasil', user, token });
  });
};

// CEK LOGIN
const checkLogin = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.toLowerCase().startsWith('bearer')) {
    return res.status(401).json({ loggedIn: false, message: 'Token tidak valid' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return res.json({ loggedIn: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ loggedIn: false, message: 'Token tidak valid' });
  }
};

// CEK USER TERDAFTAR
const checkUser = (req, res) => {
  const { username, email } = req.body;
  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Terjadi kesalahan' });
    res.json({ exist: !!row });
  });
};

// LOGOUT
const logout = (req, res) => {
  res.json({ success: true, message: 'Logout berhasil' });
};

// SUBMIT KOMENTAR
const submitComment = (req, res) => {
  const user = req.user;
  const commentText = req.body.comment;
  const image = req.file ? req.file.filename : null;

  if (!commentText) {
    return res.status(400).json({ success: false, message: 'Komentar tidak boleh kosong' });
  }

  db.run(
    'INSERT INTO comments (user_id, comment, image, created_at) VALUES (?, ?, ?, datetime("now"))',
    [user.id, commentText, image],
    function (err) {
      if (err) return res.status(500).json({ success: false, message: 'Gagal menyimpan komentar' });
      res.json({ success: true, message: 'Komentar berhasil disimpan', id: this.lastID });
    }
  );
};

// GET KOMENTAR
const getComment = (req, res) => {
  db.all(
    `SELECT comments.*, users.username 
    FROM comments 
    JOIN users ON comments.user_id = users.id 
    ORDER BY comments.created_at DESC`,
    (err, rows) => {
      console.log('[getComment] fetched comments:', rows);
      if (err) return res.status(500).json({ success: false, message: 'Gagal mengambil komentar' });
      res.json({ success: true, data: rows });
    }
  );
}


// UPDATE KOMENTAR
const updateComment = (req, res) => {
  const user = req.user;
  const { id } = req.params;
  const commentText = req.body.comment;
  const image = req.file ? req.file.filename : null;

  if (!commentText) return res.status(400).json({ success: false, message: 'Komentar kosong' });

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.get('SELECT * FROM comments WHERE id = ?', [id], (err, comment) => {
      if (err || !comment) {
        db.run('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan' });
      }
      if (comment.user_id !== user.id) {
        db.run('ROLLBACK');
        return res.status(403).json({ success: false, message: 'Tidak punya akses' });
      }

      db.run(
        'INSERT INTO log (action, user_id, username, target_com, description, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
        ['UPDATE_BACKUP', user.id, user.username, id, `Backup: ${comment.comment}`]
      );

      db.run(
        'UPDATE comments SET comment = ?, image = ? WHERE id = ?',
        [commentText, image, id],
        function (err2) {
          if (err2) {
            db.run('ROLLBACK');
            return res.status(500).json({ success: false, message: 'Gagal memperbarui komentar' });
          }

          db.run(
            'INSERT INTO log (action, user_id, username, target_com, description, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
            ['UPDATE', user.id, user.username, id, 'Komentar diperbarui']
          );

          db.run('COMMIT');
          res.json({ success: true, message: 'Komentar diperbarui' });
        }
      );
    });
  });
};

// DELETE KOMENTAR
const deleteComment = (req, res) => {
  const { id } = req.params;
  const user = req.user;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.get('SELECT * FROM comments WHERE id = ?', [id], (err, comment) => {
      if (err || !comment) {
        db.run('ROLLBACK');
        return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan' });
      }

      if (comment.user_id !== user.id && user.role !== 'admin') {
        db.run('ROLLBACK');
        return res.status(403).json({ success: false, message: 'Tidak punya akses' });
      }

      db.run(
        'INSERT INTO log (action, user_id, username, target_com, description, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
        ['DELETE_BACKUP', user.id, user.username, id, `Backup: ${comment.comment}`]
      );

      db.run('DELETE FROM comments WHERE id = ?', [id], function (err2) {
        if (err2) {
          db.run('ROLLBACK');
          return res.status(500).json({ success: false, message: 'Gagal menghapus komentar' });
        }

        db.run(
          'INSERT INTO log (action, user_id, username, target_com, description, created_at) VALUES (?, ?, ?, ?, ?, datetime("now"))',
          ['DELETE', user.id, user.username, id, 'Komentar dihapus']
        );

        db.run('COMMIT');
        res.json({ success: true, message: 'Komentar dihapus' });
      });
    });
  });
};

// EXPORT
module.exports = {
  register,
  login,
  checkLogin,
  checkUser,
  logout,
  submitComment,
  getComment,
  updateComment,
  deleteComment
};
