const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  dbUrl: process.env.SQLITE_PATH,
  jwtSecret: process.env.JWT_SECRET || 'secure-web'
};
