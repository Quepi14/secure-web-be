const db = require('./db');

// Insert user baru
const createUser = (username, email, password, role = 'user') => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users (username, email, password, role, created_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [username, email, password, role],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

// Cari user berdasarkan username
const findByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Cari user berdasarkan email
const findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Cek user apakah ada berdasarkan username/email
const findByUsernameOrEmail = (username, email) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
};

module.exports = {
  createUser,
  findByUsername,
  findByEmail,
  findByUsernameOrEmail
};
