const jwt =require('jsonwebtoken')
const JWT_SECRET = 'secure-secret'

function verifyToken( req, res, next){
    const token = req.cookies.token
    if(!token) return res.status(401).json({ messaage: 'Unauthorized'})
    try{
        const decoded = jwt.verify(token, JWT_SECRET)
        req.user = decoded
        next()
    }catch(err){
        return res.status(401).json({ messaage: 'Invalid token'})
    }
}

module.exports = verifyToken