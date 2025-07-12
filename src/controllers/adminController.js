const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/db');
const { jwtSecret } = require('../config/index');

// Login admin
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Lengkapi formnya' });
    }

    db.get('SELECT * FROM users WHERE username = ? AND role = ?', [username, 'admin'], async (err, admin) => {
      if (err || !admin) return res.status(401).json({ success: false, message: 'Username atau password salah' });

      const match = await bcrypt.compare(password, admin.password);
      if (!match) return res.status(401).json({ success: false, message: 'Username atau password salah' });

      const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, jwtSecret, { expiresIn: '1d' });

      res.cookie('token', token, { httpOnly: true, secure: false });
      res.json({ success: true, message: 'Login berhasil', admin: { id: admin.id, username: admin.username, role: admin.role }, token });
    });
  } catch (err) {
    console.error('Login Admin Error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat login admin' });
  }
};

// Cek login admin
const checkLogin = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ success: false, loggedIn: false });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    res.json({ success: true, loggedIn: true, user: decoded });
  } catch {
    res.json({ success: false, loggedIn: false });
  }
};

// Dashboard
const dashboard = (req, res) => {
  res.json({ success: true, message: 'Selamat datang di dashboard admin', admin: req.user });
};

// Verifikasi admin
const verify = (req, res) => {
  res.json({ success: true, message: 'Terverifikasi sebagai admin', admin: req.user });
};

// List semua user biasa (role = user)
const listUsers = (req, res) => {
  db.all('SELECT id, username, email, role, created_at FROM users WHERE role = ? ORDER BY created_at DESC', ['user'], (err, rows) => {
    if (err) {
      console.error('List Users Error:', err);
      return res.status(500).json({ success: false, message: 'Gagal mengambil data user' });
    }
    res.json({ success: true, users: rows });
  });
};

// Ambil data log aktivitas
const logs = (req, res) => {
  db.all('SELECT * FROM log ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Get logs error:', err);
      return res.status(500).json({ success: false, message: 'Gagal mengambil log aktivitas' });
    }
    res.json({ success: true, logs: rows });
  });
};

// Logout
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logout berhasil' });
};

module.exports = {
  login,
  checkLogin,
  dashboard,
  verify,
  listUsers,
  logs,
  logout,
};
