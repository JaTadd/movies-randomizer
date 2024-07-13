const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/movieDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
