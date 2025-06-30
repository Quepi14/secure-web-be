const express = require('express');
const auth = express.Router()
const db = require('../database/db');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'jwt-hidden'
const verifyToken = require('../middlewares/verifyToken')

auth.use((req, res, next)=>{
    console.log(req.originalUrl);
    next()
})

//sambung ke register
auth.post('/register', (req, res)=>{
    const {username, email, password} = req.body
    if(!username || !email || !password){
        return res.status(400).json({ message : 'lengkapi isinya'})
    }

    //hashing pw
    bcrypt.hash(password, saltRounds, (err, hashedPassword) =>{
        if(err){
            return res.status(500).json({ message: 'Gagal hashing password'})
        }
        db.run(
            'INSERT INTO users (username, email, password) VALUES (?,?,?)',
            [username, email, hashedPassword],
            function(err){
                if(err){
                    if(err.message.includes('UNIQUE constraint failed')){
                        return res.status(409).json({ message : 'Username atau Email sudah digunakan' })
                    }
                    return res.status(500).json({ message: 'gagal Registrasi'+ err.message})
                }res.json({ message : 'Registrasi berhasil' })
            }
            
        )
    })

})

//sambung ke login
auth.post('/login', (req, res)=>{
    const { username, password } = req.body

    if(!username || !password){
        return res.status(400).json({ message : 'Isi dengan lengkap'})
    }

    db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
            if(err){
                return res.status(500).json({ message: 'Terjadi Kesalahan' +err.message})
            }
            
            if(!row){
                return res.status(401).json({ message: 'Akun tidak ditemukan atau password salah' })
            }
            //compare password yang di hash dan tidak
            bcrypt.compare(password, row.password, (err, result) =>{
                if(err){
                    return res.status(500).json({ message : 'Gagal Compare'})
                }
                if(result){
                    const userData = {
                        id: row.id,
                        username : row.username,
                        email: row.email
                    }

                    req.session.user = userData

                    const token = jwt.sign(userData, JWT_SECRET, {expiresIn: '1h'})

                    res.cookie('token', token, {
                        httpOnly:true,
                        maxAge:1000*60*60,
                        secure:false
                    })

                    return res.json({
                        success: true,
                        message: 'Login Berhasil',
                        user: userData
                    })
                }else{
                    return res.status(401).json({ 
                        success:false,
                        message: 'Password Salah'
                    })//jika tidak
                }
            })
        }
    )
    }
)

auth.get('/secure-route', verifyToken, (req, res)=>{
    res.json({
        message: 'Secured',
        user: req.user
    })
})

//cek user login or not
auth.get('/check', (req, res)=>{
    const token = req.cookies.token
    if(token){
        try{
            const decoded = jwt.verify(token, JWT_SECRET)
            return res.json({ loggedIn: true, user: decoded})
        }catch (err){
            return res.json({ loggedIn: false})
        }
    }
    if(req.session.user){
        return res.json({ loggedIn: true, user: req.session.user})
    }
     return res.json({ loggedIn: false})
})

//check user
auth.post('/check-user', (req, res) => {
    const { username, email} = req.body
    db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], (err, row) => {
        if (err) return res.status(500).json({ message : 'Terjadi kesalahan'})
        if(row){
            return res.json({ exist: true}) //jka user sudah ada
        }else{
            return res.json({ exist: false}) //user belum ada
        }
    })
})


auth.post('/logout', (req, res)=>{
    res.clearCookie('token')
    req.session.destroy(()=>{
        res.json({ message: 'LogOut berhasil'})
    })
})


module.exports = auth