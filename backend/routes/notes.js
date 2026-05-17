const router = require('express').Router();
const Note = require('../models/Note');

router.get('/', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

router.post('/:diseaseId', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { disease: req.params.diseaseId },
      { content: req.body.content },
      { upsert: true, new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:diseaseId', async (req, res) => {
  await Note.findOneAndDelete({ disease: req.params.diseaseId });
  res.json({ message: 'Deleted' });
});

module.exports = router;
