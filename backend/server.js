require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const diseaseRoutes = require('./routes/diseases');
const categoryRoutes = require('./routes/categories');
const noteRoutes = require('./routes/notes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB error FULL:', err);
  });

app.use('/api/diseases', diseaseRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notes', noteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
