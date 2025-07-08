require('dotenv').config()

module.exports = {
    dbUrl: process.env.SQLITE_PATH || './database.sqlite',
    port: process.env.PORT || 3300,
    jwtSecret: process.env.JWT_SECRET || 'secure-web',
    env: process.env.NODE_ENV || 'development'
}