const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername, findUserByUsernameOrEmail } = require('../models/userModel');
const { jwtSecret } = require('../config');

const registerUser = async (username, email, password) => {
  console.log('[REGISTER]', { password }); // log input
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log('[HASHED]', { hashedPassword });
  const id = await createUser(username, email, hashedPassword);
  return id;
};


const loginUser = async (username, password) => {
  try {
    const user = await findUserByUsername(username);
    if (!user) throw new Error('User tidak ditemukan');

    console.log('Login attempt:', { password, stored: user.password });

    const valid = await bcrypt.compare(password, user.password);
    console.log('bcrypt result:', valid);

    if (!valid) throw new Error('Password salah');

    console.log('JWT Secret', jwtSecret);
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return { user, token };
  } catch (err) {
    console.error('LoginUser error:', err.message);
    throw err; 
  }
};


module.exports = {
  registerUser,
  loginUser,
  findUserByUsernameOrEmail,
};
