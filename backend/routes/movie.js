const express = require('express');
const jwt = require('jsonwebtoken'); // Assurez-vous que jwt est importé
const Movie = require('../models/Movie');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();
const { PythonShell } = require('python-shell');
const path = require('path');


<<<<<<< HEAD
const modelPath = path.resolve(__dirname, '../ml_models/content_based_model.pkl');
const tfidfPath = path.resolve(__dirname, '../ml_models/tfidf_vectorizer.pkl');



=======
>>>>>>> origin/dev
// Route pour chercher des films
router.get('/search', async (req, res) => {
  const { title } = req.query;
  if (!title) {
    return res.status(400).send('Title is required');
  }
  
  try {
    const movies = await Movie.find({ title: new RegExp(title, 'i') })
                              .sort({ NumVotes: -1 }) // Trie par NumVotes décroissant
                              .limit(50); // Limite les résultats à 50 films pour améliorer la performance
    
    res.json(movies);
  } catch (error) {
    console.error('Error searching for movies:', error);
    res.status(500).send('Server error');
  }
});

// Route pour ajouter un film (réservée aux administrateurs)
router.post('/add-movie', [auth, admin], async (req, res) => {
  const { title, genre, year, image } = req.body; // Inclure image
  if (!title || !genre || !year) {
    return res.status(400).send('All fields are required');
  }
  const movie = new Movie({ title, genre, year, image }); // Ajouter image
  await movie.save();
  res.status(201).send('Movie added');
});

// Fonction pour obtenir le filtre de popularité
const getPopularityFilter = (popularity) => {
  switch (parseInt(popularity, 10)) {
    case 800:
      return { NumVotes: { $gte: 800 } };
    case 1500:
      return { NumVotes: { $gte: 1500 } };
    case 3500:
      return { NumVotes: { $gte: 3500 } };
    case 300000:
      return { NumVotes: { $gte: 300000 } };
    default:
      return {};
  }
};

// Récupérer un film aléatoire pour les utilisateurs connectés
router.get('/random-movie-auth', auth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate('watchedMovies');
    const watchedMovieIds = user.watchedMovies.map(movie => movie._id);
    
    // Filtrer par genres, note et popularité si spécifiés
    const genres = req.query.genres ? req.query.genres.split(',') : [];
    const rating = req.query.rating ? parseInt(req.query.rating, 10) : 0;
    const popularityFilter = getPopularityFilter(req.query.popularity);
    
    const match = { 
      _id: { $nin: watchedMovieIds },
      IMDBRating: { $gte: rating },
      ...popularityFilter
    };
    if (genres.length) {
      match.genres = { $in: genres };
    }
    
    // Utiliser l'agrégation pour échantillonner un film aléatoire qui n'est pas dans watchedMovies
    const movies = await Movie.aggregate([
      { $match: match },
      { $sample: { size: 1 } }
    ]);
    
    if (movies.length === 0) {
      return res.status(404).send('No movies available');
    }
    
    res.json(movies[0]);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});

// Récupérer un film aléatoire pour les utilisateurs non connectés
router.get('/random-movie', async (req, res) => {
  try {
    // Filtrer par genres, note et popularité si spécifiés
    const genres = req.query.genres ? req.query.genres.split(',') : [];
    const rating = req.query.rating ? parseInt(req.query.rating, 10) : 0;
    const popularityFilter = getPopularityFilter(req.query.popularity);

    const match = { 
      IMDBRating: { $gte: rating },
      ...popularityFilter
    };
    if (genres.length) {
      match.genres = { $in: genres };
    }

    // Utiliser l'agrégation pour échantillonner un film aléatoire
    const movies = await Movie.aggregate([
      { $match: match },
      { $sample: { size: 1 } }
    ]);

    if (movies.length === 0) {
      return res.status(404).send('No movies available');
    }
    
    res.json(movies[0]);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});


// Récupérer les films vus par l'utilisateur
router.get('/profile', auth, async (req, res) => {
  const userId = req.userId;
  const user = await User.findById(userId).populate('watchedMovies');
  res.json(user.watchedMovies);
});

// Route pour marquer un film comme vu
router.post('/mark-as-watched', auth, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user.watchedMovies.includes(movieId)) {
    user.watchedMovies.push(movieId);
    await user.save();
    res.status(200).send('Movie marked as watched');
  } else {
    res.status(400).send('Movie already marked as watched');
  }
});

// Route pour retirer un film de la liste des films vus
router.post('/remove-from-watched', auth, async (req, res) => {
  const { movieId } = req.body;
  const userId = req.userId;

  const user = await User.findById(userId);
  const index = user.watchedMovies.indexOf(movieId);
  if (index > -1) {
    user.watchedMovies.splice(index, 1);
    await user.save();
    res.status(200).send('Movie removed from watched list');
  } else {
    res.status(400).send('Movie not found in watched list');
  }
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


<<<<<<< HEAD
router.get('/recommendations', auth, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Récupérer les films vus par l'utilisateur
    const user = await User.findById(userId).populate('watchedMovies');
    const watchedMovies = user.watchedMovies;

    if (!watchedMovies || watchedMovies.length === 0) {
      return res.status(400).json({ message: 'Ajoutez un film pour avoir des recommandations' });
=======
const modelPath = path.resolve(__dirname, "../ml_models/content_based_model.pkl");
const tfidfPath = path.resolve(__dirname, "../ml_models/tfidf_vectorizer.pkl");

router.get("/recommendations", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).populate("watchedMovies");
    const watchedMovies = user.watchedMovies;

    if (!watchedMovies || watchedMovies.length === 0) {
      return res.status(400).json({ message: "Ajoutez un film pour avoir des recommandations" });
>>>>>>> origin/dev
    }

    // Préparer les titres des films vus
    const watchedTitles = watchedMovies.map((movie) => movie.title);
<<<<<<< HEAD

    // Appeler le script Python pour générer des recommandations
    const options = {
      args: [
        JSON.stringify(watchedTitles),
        modelPath,
        tfidfPath
      ]
    };

    PythonShell.run('./ml_models/recommendation_script.py', options, (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'exécution du script Python :', err);
        return res.status(500).json({ message: 'Erreur lors de la génération des recommandations.' });
      }

      // Retourner les recommandations au client
      const recommendations = JSON.parse(results[0]);
      res.json(recommendations);
    });
  } catch (err) {
    console.error('Erreur dans la route /recommendations :', err);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
=======
    console.log("Films vus par l'utilisateur :", watchedTitles);

    // Vérifier si les fichiers modèles existent
    const fs = require("fs");
    if (!fs.existsSync(modelPath) || !fs.existsSync(tfidfPath)) {
      return res.status(500).json({ message: "Fichiers de modèle manquants." });
    }

    console.log("Modèle chargé :", modelPath);
    console.log("TF-IDF chargé :", tfidfPath);

    // Exécuter le script Python
    let options = {
      mode: "text",
      pythonOptions: ["-u"], // '-u' pour désactiver le buffering
      args: [JSON.stringify(watchedTitles), modelPath, tfidfPath],
    };

    console.log("Exécution du script Python...");
    PythonShell.run("./ml_models/recommendation_script.py", options, (err, results) => {
      if (err) {
        console.error("Erreur Python :", err);
        return res.status(500).json({ message: "Erreur lors de la génération des recommandations.", error: err.message });
      }

      console.log("Sortie brute du script Python :", results);

      try {
        // Vérifier si la sortie est valide
        if (!results || results.length === 0) {
          throw new Error("Aucune donnée renvoyée par le script Python");
        }

        const recommendations = JSON.parse(results.join(""));
        console.log("Recommandations générées :", recommendations);
        res.json({ recommendations });
      } catch (parseError) {
        console.error("Erreur lors du parsing JSON :", parseError);
        res.status(500).json({ message: "Réponse invalide du modèle.", error: parseError.message });
      }
    });
  } catch (err) {
    console.error(" Erreur serveur :", err);
    res.status(500).json({ message: "Erreur interne du serveur.", error: err.message });
>>>>>>> origin/dev
  }
});

module.exports = router;