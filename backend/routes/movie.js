const express = require('express');
const Movie = require('../models/Movie');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Route pour chercher des films
router.get('/search', async (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).send('Title is required');
  }
  const movies = await Movie.find({ title: new RegExp(title, 'i') }); // recherche insensible à la casse
  res.json(movies);
});

// Récupérer un film aléatoire
router.get('/random-movie', async (req, res) => {
  const movies = await Movie.find();
  const randomIndex = Math.floor(Math.random() * movies.length);
  res.json(movies[randomIndex]);
});

// Récupérer les films vus par l'utilisateur
router.get('/profile', auth, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).populate('watchedMovies');
  res.json(user.watchedMovies);
});

// Marquer un film comme vu
router.post('/mark-as-watched', auth, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user.watchedMovies.includes(movieId)) {
    user.watchedMovies.push(movieId);
    await user.save();
  }

  res.status(200).send('Movie marked as watched');
});

module.exports = router;
