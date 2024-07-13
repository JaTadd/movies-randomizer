const express = require('express');
const Movie = require('../models/Movie');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/random-movie', async (req, res) => {
  const movies = await Movie.find();
  const randomIndex = Math.floor(Math.random() * movies.length);
  res.json(movies[randomIndex]);
});

router.get('/profile', auth, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).populate('watchedMovies');
  res.json(user.watchedMovies);
});

module.exports = router;
