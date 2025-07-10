const { jwtSecret } = require('../config/index');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser, findUserByUsernameOrEmail } = require('../services/authService');
const {
  insertComment,
  getAllComments,
  getCommentById,
  updateCommentById,
  deleteCommentById
} = require('../models/commentModel');
const { insertLog } = require('../models/logModel');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Lengkapi semua isian' });
  }

  try {
    await registerUser(username, email, password);
    res.json({ success: true, message: 'Registrasi berhasil' });
  } catch (err) {
    console.error('Register error detail:', err);
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ success: false, message: 'Username atau email sudah digunakan' });
    }
    res.status(500).json({ success: false, message: 'Gagal registrasi' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Isi lengkap' });
  }

  try {
    const { user, token } = await loginUser(username, password);
    res.json({ success: true, message: 'Login berhasil', user, token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).json({ success: false, message: err.message });
  }
};

const checkLogin = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({
      loggedIn: false,
      message: 'Token tidak valid'
    });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    return res.json({ loggedIn: true, user: decoded });
  } catch (err) {
    console.error('[JWT VERIFY ERROR]', err.message);
    return res.status(401).json({ loggedIn: false, message: 'Token tidak valid' });
  }
};

const checkUser = async (req, res) => {
  const { username, email } = req.body;
  try {
    const user = await findUserByUsernameOrEmail(username, email);
    res.json({ exist: !!user });
  } catch {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan' });
  }
};

const logout = (req, res) => {
  res.json({ success: true, message: 'Logout berhasil' });
};

const comment = async (req, res) => {
  const user = req.user;
  const commentText = req.body.comment;
  const image = req.file ? req.file.filename : null;

  if (!commentText) return res.status(400).json({ success: false, message: 'Komentar kosong' });

  try {
    await insertComment(user.id, commentText, image);
    res.json({ success: true, message: 'Komentar disimpan' });
  } catch (err) {
    console.error('Insert comment error:', err);
    res.status(500).json({ success: false, message: 'Gagal simpan komentar' });
  }
};

const getComments = async (req, res) => {
  try {
    const rows = await getAllComments();
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Get comments error:', err);
    res.status(500).json({ success: false, message: 'Gagal ambil komentar' });
  }
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const image = req.file ? req.file.filename : null;
  const userId = req.user.id;

  if (!comment) {
    return res.status(400).json({ success: false, message: 'Komentar kosong' });
  }

  try {
    const existingComment = await getCommentById(id);
    if (!existingComment) {
      return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan' });
    }

    if (existingComment.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Kamu tidak berhak mengedit komentar ini' });
    }

    const result = await updateCommentById(id, comment, image);
    if (result === 0) {
      return res.status(500).json({ success: false, message: 'Gagal memperbarui komentar' });
    }

    await insertLog('UPDATE', userId, req.user.username, id, 'User memperbarui komentar');
    res.json({ success: true, message: 'Komentar diperbarui' });
  } catch (err) {
    console.error('Update comment error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui komentar' });
  }
};

const deleteComment = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const existingComment = await getCommentById(id);
    if (!existingComment) {
      return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan' });
    }

    if (existingComment.user_id !== userId && userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Tidak memiliki akses untuk menghapus komentar ini' });
    }

    const result = await deleteCommentById(id);
    if (result === 0) {
      return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan atau sudah dihapus' });
    }

    await insertLog('DELETE', userId, req.user.username, id, 'User menghapus komentar');
    res.json({ success: true, message: 'Komentar dihapus' });
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus komentar' });
  }
};

module.exports = {
  register,
  login,
  checkLogin,
  checkUser,
  logout,
  comment,
  getComments,
  updateComment,
  deleteComment
};
