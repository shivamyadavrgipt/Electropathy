const router = require('express').Router();
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  const cats = await Category.find().sort({ name: 1 });
  res.json(cats);
});

router.post('/', async (req, res) => {
  try {
    const cat = await Category.create({ name: req.body.name });
    res.status(201).json(cat);
  } catch (err) {
    res.status(400).json({ message: 'Category already exists or invalid' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
