const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  disease: { type: mongoose.Schema.Types.ObjectId, ref: 'Disease', required: true, unique: true },
  content: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
