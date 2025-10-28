const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');

    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении пользователей'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      status: 'success',
      data: { user: userWithoutPassword }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при создании пользователя'
    });
  }
});

module.exports = router;