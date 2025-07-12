const jwt = require('jsonwebtoken');
const { loginAdmin, getAllUsers } = require('../services/adminService');
const { jwtSecret } = require('../config/index');
const { getLogs } = require("../models/logModel")

const login = async (req, res) => {
  try {
    const { username, password} = req.body
    if(!username || password){
      return res.status(400).json({ successLfalse, message: 'Lengakpi formnya'})
    }

    const admin = await user.findone({ where : {username, role:'admin'}})
    if(!admin || !(await bcrypt.compare(password, admin.password))){
      return res.status(401).json({ success:false, message:'Username atau password salah'})
    }

    const token = jwt.sign({ id:admin.id, username:admin.username, role:admin.role }, jwtSecret,{expiresIn: '1d'})

    res.cookie('token',token, {httpOnly:true, secure:false})
    res.json({ success:true, message:'Login berhasil', admin: { id: admin.id, username: admin.username, role:admin.role}, token})
  }catch (err) {
    console.error(('Login Admin Error:', err));    
    res.status(401).json({ success:false, message:err.message})
  }
};


const checkLogin = (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.json({ success: false, loggedIn: false });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    res.json({ success: true, loggedIn: true, user: decoded });
  } catch {
    res.json({ success: false, loggedIn: false });
  }
};

const dashboard = (req, res) => {
  res.json({ success: true, message: 'Selamat datang di dashboard admin', admin: req.user });
};

const verify = (req, res) => {
  res.json({ success: true, message: 'Terverifikasi sebagai admin', admin: req.user });
};


const listUsers = async (req, res) => {
  try {
    const users = await user.findAll({
      attributes: ['id', 'username', 'email','role', 'created_at'],
      where: { role: 'user'},
      order:[['created_at', 'DESC']]
    });
    res.json({ success: true, users });
  } catch {
    console.error('List Users Error:',err);
    res.status(500).json({ success: false, message: 'Gagal mengambil data user' });
  }
};

const logs = async (req, res) => {
  try {
    const logData = await log.findAll({
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, logs: logData });
  } catch (err) {
    console.error('Get logs error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil log aktivitas' });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logout berhasil' });
};

module.exports = {
  login,
  checkLogin,
  dashboard,
  verify,
  listUsers,
  logs,
  logout,
};
