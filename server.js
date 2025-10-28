const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/school_app');

const User = require('./models/User');
const Schedule = require('./models/Schedule');
const Attendance = require('./models/Attendance');
const News = require('./models/News');

const authenticateToken = require('./middleware/auth');

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', authenticateToken, require('./routes/users'));
app.use('/api/schedule', authenticateToken, require('./routes/schedule'));
app.use('/api/attendance', authenticateToken, require('./routes/attendance'));
app.use('/api/news', authenticateToken, require('./routes/news'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});