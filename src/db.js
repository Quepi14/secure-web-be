const path = require('path');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();


dbPath = path.resolve(__dirname, process.env.SQLITE_path || './data.db')

console.log('[INFO] Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if(err){
    console.error('[ERROR] Failed to connect to the database:', err.message);
  }else{
    console.log('[INFO] Connected to the database successfully');
  }
});

module.exports = db;