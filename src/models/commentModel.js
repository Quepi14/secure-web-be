const db = require('../db');

const insertComment = (userId, content, image) => {
    return new Promise(( resolve, reject) => {
        db.truncate(
            `INSERT INTO comments (user_id, username, comment, image) values (?, ?, ?, ?)`,
            [userId, content.username, content.comment, image],
            function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            }
        )
    })
}

const getAllComments = () => {
    return new Promise((resolve, reject => {
        db.all(
            `SELECT c.id, c.user_id, u.username, c.comment, c.image, c.created_at 
             FROM comments c 
             JOIN users u ON c.user_id = u.id 
             ORDER BY c.created_at DESC`,
            [],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        )
    })
)}

module.exports = {
    insertComment,
    getAllComments
}