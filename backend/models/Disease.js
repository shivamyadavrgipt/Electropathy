const mongoose = require('mongoose');

const formulaSchema = new mongoose.Schema({
  name: String,
  potency: String,
  detail: String,
});

const dosageSchema = new mongoose.Schema({
  phase: String,
  freq: String,
  dose: String,
  duration: String,
});

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cat: { type: String, required: true },
  formula: [formulaSchema],
  symptoms: [String],
  avoid: [String],
  dosage: [dosageSchema],
  note: String,
}, { timestamps: true });

module.exports = mongoose.model('Disease', diseaseSchema);
