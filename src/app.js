const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const { sequelize } = require('./models/db')

//routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const healthRoutes = require('./routes/healthCheck');
const adminCommentRoutes = require('./routes/adminCommentRoutes')
const commentRoutes = require('./routes/commentRoutes')

//middleware
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//static upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//link to routes
app.use('/secure-app', healthRoutes);
app.use('/secure-app/auth', authRoutes);//user routes
app.use('/secure-app/comments', commentRoutes);//user comment
app.use('/secure-app/admin', adminRoutes); //login, dashboard, logs admin
app.use('/secure-app/admin/comments', adminCommentRoutes) //admin manage komen


sequelize.sync({ alter:true})
.then(() =>{
    console.log('Database & table synced');
})
.catch(err => {
    console.error('Sequelize sync error:', err);
})

const cleanRoutes = require('./routes/cleanRoutes');
app.use('/secure-app/debug', cleanRoutes);




module.exports = app;
