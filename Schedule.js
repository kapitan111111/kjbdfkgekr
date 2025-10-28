const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  subject: { type: String, required: true },
  teacher: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: String, required: true },
  classroom: { type: String, required: true },
  type: { type: String, enum: ['lecture', 'practice', 'lab'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);