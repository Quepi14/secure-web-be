const { jwtSecret } = require('../config/index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const {Op} = require('sequelize')
const { user, comment, log } = require('../models/db');

const register = async (req, res) => {
  console.log('BODY:', req.body)
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Lengkapi formnya!' })
  }

  try {
    const existing = await user.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });
    console.log("EXISTING USER:", existing);

    if (existing) {
      return res.status(400).json({ success: false, message: 'Username atau email sudah digunakan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await user.create({ username, email, password: hashedPassword, role: 'user' })
    res.json({ success: true, message: 'Registrasi berhasil' })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ success: false, message: 'Gagal registrasi' })
  }
}

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Isi lengkap' });
  }

  try {
    const foundUser = await user.findOne({ where: { username } });
    if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
      throw new Error('Username atau Password salah');
    }

    const token = jwt.sign(
      {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role
      },
      jwtSecret,
      { expiresIn: '1h' }
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role
      },
      token
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(401).json({ success: false, message: err.message });
  }
};


const checkLogin = (req, res) =>{
  const authHeader = req.headers.authorization
  if (!authHeader?.toLowerCase().startsWith('bearer')) {
    return res.status(401).json({ loggedIn: false, message: 'Token tidak valid' });
  }
  const token = authHeader.split(' ') [1]

  try{
    const decoded = jwt.verify(token, jwtSecret)
    return res.json({ loggedIn: true, user:decoded})
  }catch(err){
    console.error('[JWT VERIFY ERROR', err.message);
    return res.status(401).json({ loggedIn:false, message:'Token tidak valid'})
  }
}

const checkUser = async (req, res) => {
  const {username, email} = req.body
  try{
    const user = await user.findOne({ where: { [Op.or]: [{username}, {email}]}})
    res.json({ exist: !!user})
  }catch {
    res.status(500).json({ success: false, message: 'Terjadi kesalahan' })
  }
}

const logout = (req, res) => {
  res.json({ success:true, message: 'Logout berhasil'})
}

const submitComment = async (req, res) => {
  const user = req.user
  const commentText = req.body.comment
  const image = req.file ? req.file.filename : null

  if(!commentText) return res.status(400).json({ success: false, message: 'Komentar kurang'})

  try{
    const newComment = await comment.create({
      user_id : user.id,
      comment: commentText,
      image: image
    }) 
    res.json({ success: true, message: 'Komentar disimpan', date: newComment})
  }catch(err){
    console.error('Insert comment error:', err);
    res.status(500).json({ success:false, message:'Gagal simpan komentar'})
  }
}

const getComment = async(req, res) =>{
  try{
    const rows = await comment.findAll({
      include: [{model:user, attributes: ['username']}],
      order:[['created_at', 'DESC']]
    })
    res.json({ success:true, data: rows})
  }catch (err){
    console.error('Get comment error:', err)
    res.status(500).json({ success: false, message:'Gagal mengambil komentar'})
  }
}

const updateComment = async(req, res)=>{
  const { id } = req.params
  const { comment } = req.body
  const image = req.file? req.file.filename : null
  const  userId = req.user.id

  if(!comment) return res.status(400).json({ success:false, message:'Komentar kosong'})

  try{
    const existing = await comment.findByPk(id)
    if(!existing) return res.status(404).json({ success:false, message:'komentar tidak ditemukan'})
    if(existing.user_id !== userId) return res.status(403).json({ success: false, message: 'Tidak punya akses untuk mengedit komentar '})

    await existing.update({ comment, image})
    await log.create({ action:'UPDATE', user_id:userId, username:req.user.username, target_com: id, description:'User memperbarui komentar'})
    res.json({ success: true, message: 'Komentar diperbarui'})    
  }catch(err){
    console.error('Update comment error:', err);
    res.status(500).json({ success: false, message:'Gagal memperbarui komentar'})
  }
}

const deleteComment = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const role = req.user.role

  try{
    const existing = await comment.findByPk(id)
    if(!existing) return res.status(404).json({ success: false, message: 'Komentar tidak ditemukan'})
    if(existing.user_id !== iserOD && role !== 'admin'){
      return res.status(403).json({ success:false, message:'Tidak memiliki akses untuk menghapus komentar ini'})
    }

    await existing.destroy()
    await log.create({ action: 'DELETE', user_id:userId, username:req.user.username, target_com:id, description:'User menghapus koemntar'})
    res.json({ success:true, message:'Komentar dihapus'})
  }catch(err){
    console.error(('Delete comment error:', err));
    res.status(500).json({ success:false, message:'Gagal menghapus komentar'})
  }
}

module.exports = {
  register,
  login,
  checkLogin,
  checkUser,
  logout,
  submitComment,
  getComment,
  updateComment,
  deleteComment
}