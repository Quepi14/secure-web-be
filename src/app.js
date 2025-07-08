const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const healthRoutes = require('./routes/healthCheck');
const adminCommentRoutes = require('./routes/adminCommentRoutes')

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/secure-app', healthRoutes);
app.use('/secure-app/admin', adminRoutes);
app.use('/secure-app/auth', authRoutes);
app.use('/admin',  adminCommentRoutes)
app.use('/comments', adminCommentRoutes)



module.exports = app;
