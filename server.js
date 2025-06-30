const express = require('express');
const app = express()
const port = 3300
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const session = require('express-session')

function logger(req, res, next){
    console.log(req.originalUrl);
    next()
}

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))


app.use(cookieParser())
app.use(logger)
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())


/*
app.get('/', (req, res)=> {
    res.render('index')
})
*/
//cookie
app.use(session({
    secret:'super-aman',
    resave: false,
    saveUnitialized: false,
    cookie:{
        httpOnly: true,
        maxAge: 1000 *60 * 60, //session untuk satu jam
        secure: false //false untuk http tapi true untuk https 
    }
}))


//linked to auth
const auth = require('./routes/auth');
const { json } = require('stream/consumers');
app.use('/auth', auth);

//port
app.listen(port,  ()=>{
    console.log(`Server Berjalan di http://localhost:${port}` );
    
})