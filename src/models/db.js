// File ini mengatur koneksi ke SQLite menggunakan SQL mentah (tanpa Sequelize)

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path menuju database file
const dbPath = path.resolve(__dirname, '..', 'data.db');

// Membuka koneksi ke database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Gagal koneksi ke SQLite:', err.message);
  } else {
    console.log('Terhubung ke database SQLite di', dbPath);
  }
});

module.exports = db;
