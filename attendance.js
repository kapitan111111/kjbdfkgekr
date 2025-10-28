const express = require('express');
const Attendance = require('../models/Attendance');

const router = express.Router();

router.get('/student/:studentId', async (req, res) => {
  try {
    const { date } = req.query;
    let filter = { studentId: req.params.studentId };

    if (date) filter.date = date;

    const attendance = await Attendance.find(filter)
      .populate('scheduleId')
      .sort({ date: -1 });

    res.status(200).json({
      status: 'success',
      results: attendance.length,
      data: { attendance }
    });
  } catch (error) {
    console.error('Get student attendance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении посещаемости'
    });
  }
});

router.get('/schedule/:scheduleId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ scheduleId: req.params.scheduleId })
      .populate('studentId', 'name email group')
      .sort({ 'studentId.name': 1 });

    res.status(200).json({
      status: 'success',
      results: attendance.length,
      data: { attendance }
    });
  } catch (error) {
    console.error('Get schedule attendance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при получении посещаемости'
    });
  }
});

router.post('/mark', async (req, res) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Необходим массив записей посещаемости'
      });
    }

    if (records.length > 0) {
      await Attendance.deleteMany({
        scheduleId: records[0].scheduleId,
        date: records[0].date
      });
    }

    const attendanceRecords = await Attendance.insertMany(records);

    await Attendance.populate(attendanceRecords, [
      { path: 'studentId', select: 'name email group' },
      { path: 'scheduleId' }
    ]);

    res.status(201).json({
      status: 'success',
      results: attendanceRecords.length,
      data: { attendance: attendanceRecords }
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при отметке посещаемости'
    });
  }
});

module.exports = router;