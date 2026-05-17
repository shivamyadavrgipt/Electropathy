const router = require('express').Router();
const Disease = require('../models/Disease');

router.get('/', async (req, res) => {
  try {
    const diseases = await Disease.find().sort({ createdAt: -1 });
    res.json(diseases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.id);
    if (!disease) return res.status(404).json({ message: 'Not found' });
    res.json(disease);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const disease = await Disease.create(req.body);
    res.status(201).json(disease);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const disease = await Disease.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!disease) return res.status(404).json({ message: 'Not found' });
    res.json(disease);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Disease.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
