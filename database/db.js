const sqlite3 = require('sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'data.db')

console.log('Database path', dbPath);

const db = new sqlite3.Database(dbPath, (err)=> {
    if(err){
        console.error('Gagal konek ke Database', err);
    }else{
        console.log('Berhasil konek ke Database');

        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT null,
            email TEXT UNIQUE NOT null,
            password TEXT NOT NULL
        )`)
    }
})

module.exports = db