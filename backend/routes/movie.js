const express = require('express');
const jwt = require('jsonwebtoken'); // Assurez-vous que jwt est importé
const Movie = require('../models/Movie');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
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

// Route pour ajouter un film (réservée aux administrateurs)
router.post('/add-movie', [auth, admin], async (req, res) => {
  const { title, genre, year } = req.body;
  if (!title || !genre || !year) {
    return res.status(400).send('All fields are required');
  }
  const movie = new Movie({ title, genre, year });
  await movie.save();
  res.status(201).send('Movie added');
});

// Récupérer un film aléatoire pour les utilisateurs connectés
router.get('/random-movie-auth', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate('watchedMovies');
    const watchedMovieIds = user.watchedMovies.map(movie => movie._id);
    
    const movies = await Movie.find({ _id: { $nin: watchedMovieIds } });
    if (movies.length === 0) {
      return res.status(404).send('No movies available');
    }
    
    const randomIndex = Math.floor(Math.random() * movies.length);
    res.json(movies[randomIndex]);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Récupérer un film aléatoire pour les utilisateurs non connectés
router.get('/random-movie', async (req, res) => {
  try {
    const movies = await Movie.find();
    if (movies.length === 0) {
      return res.status(404).send('No movies available');
    }
    
    const randomIndex = Math.floor(Math.random() * movies.length);
    res.json(movies[randomIndex]);
  } catch (error) {
    res.status(500).send('Server error');
  }
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

// Récupérer tous les films
router.get('/all-movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
