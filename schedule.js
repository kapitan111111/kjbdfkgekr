const express = require('express');
const Schedule = require('../models/Schedule');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { group, teacherId, date } = req.query;
    let filter = {};

    if (group) filter.group = group;
    if (teacherId) filter.teacherId = teacherId;
    if (date) filter.date = date;

    const schedules = await Schedule.find(filter)
      .populate('teacherId', 'name email')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      status: 'success',
      results: schedules.length,
      data: { schedules }
    });
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении расписания'
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    await schedule.populate('teacherId', 'name email');

    res.status(201).json({
      status: 'success',
      data: { schedule }
    });
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при создании занятия'
    });
  }
});

module.exports = router;