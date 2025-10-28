const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  notes: String,
}, { timestamps: true });

attendanceSchema.index({ studentId: 1, scheduleId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);