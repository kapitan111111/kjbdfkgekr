const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  importance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  targetGroups: [{ type: String, required: true }],
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);