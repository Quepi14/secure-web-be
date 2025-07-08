const { jwtSecret } = require('../utils/config');
const jwt = require('jsonwebtoken');
const { registerUser, loginUser, findUserByUsernameOrEmail } = require('../services/authService');
const db = require('../db.js');

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
  console.log('Request BODY:', req.body); 
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Isi lengkap' });
  }

  try {
    const { user, token } = await loginUser(username, password);
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60,
      secure: false,
    });
    res.json({ success: true, message: 'Login berhasil', user, token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).json({ success: false, message: err.message });
  }
};


const checkLogin = (req, res) => {
  const token = req.cookies.token;
  
  if (!token){
    return res.status(401).json({
      loggedIn: false,
      message : 'Tidak ada token, akses ditolak' 
    });
  } 

  try {
    const decoded = jwt.verify(token, jwtSecret);
    return res.json({ loggedIn: true, user: decoded });
  } catch {
    console.error('[JWT VERIFY ERROR]', err.message);
    return res.status(401).json({ loggedIn: false });
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
  res.clearCookie('token');
  req.session?.destroy?.(() => {});
  res.json({ success: true, message: 'Logout berhasil' });
};

const comment = (req, res) => {
  const user = req.user;
  const { comment } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!comment) return res.status(400).json({ success: false, message: 'Komentar kosong' });

  db.run(
    'INSERT INTO comments (user_id, comment, image) VALUES (?, ?, ?)',
    [user.id, comment, image],
    (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Gagal simpan komentar' });
      res.json({ success: true, message: 'Komentar disimpan' });
    }
  );
};

const getComments = (req, res) => {
  const query = `
    SELECT comments.comment, comments.image, comments.created_at, users.username
    FROM comments
    JOIN users ON comments.user_id = users.id
    ORDER BY comments.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Gagal ambil komentar' });
    res.json(rows);
  });
};

module.exports = {
  register,
  login,
  checkLogin,
  checkUser,
  logout,
  comment,
  getComments,
};
