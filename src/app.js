const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');

// routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const healthRoutes = require('./routes/healthCheck');
const adminCommentRoutes = require('./routes/adminCommentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const cleanRoutes = require('./routes/cleanRoutes');

// middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/secure-app', healthRoutes);
app.use('/secure-app/auth', authRoutes); // user register/login
app.use('/secure-app/comments', commentRoutes); // user comment routes
app.use('/secure-app/admin', adminRoutes); // admin login, dashboard, logs
app.use('/secure-app/admin/comments', adminCommentRoutes); // admin comment management
app.use('/secure-app/debug', cleanRoutes); // route for debugging / reset

module.exports = app;
