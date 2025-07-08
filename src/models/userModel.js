const db = require('../db');

const getUserByUsernameAndRole = (username, role) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE username = ? AND TRIM(LOWER(role)) = ?`,
      [username.trim(), role.toLowerCase()],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
};

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT id, username, email, role, created_at FROM users', [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const createUser = (username, email, hashedPassword) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'user'],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
};

const findUserByUsername = (username) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

const findUserByUsernameOrEmail = (username, email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

module.exports = {
  getUserByUsernameAndRole,
  getAllUsers,
  createUser,
  findUserByUsername,
  findUserByUsernameOrEmail,
};
