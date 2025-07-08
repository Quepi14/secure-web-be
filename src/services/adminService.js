const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/index');
const { getUserByUsernameAndRole, getAllUsers } = require('../models/userModel');

const loginAdmin = async (username, password) => {
  const adminUser = await getUserByUsernameAndRole(username, 'admin');
  if (!adminUser) throw new Error('Username atau password salah');

  const match = await bcrypt.compare(password, adminUser.password);
  if (!match) throw new Error('Username atau password salah');

  const payload = {
    id: adminUser.id,
    username: adminUser.username,
    email: adminUser.email,
    role: adminUser.role,
  };

  const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

  return { admin: payload, token };
};

module.exports = {
  loginAdmin,
  getAllUsers,
};
