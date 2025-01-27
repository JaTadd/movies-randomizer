const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const seedMovies = async () => {
  try {
    // Connexion à MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/movieDB';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connexion à MongoDB réussie.');

    // Ajouter des films à la base de données
    const movies = [
      { title: 'Inception', genres: ['Sci-Fi'], year: 2010, IMDBRating: 8.8, NumVotes: 1000000 },
      { title: 'Interstellar', genres: ['Sci-Fi', 'Drama'], year: 2014, IMDBRating: 8.6, NumVotes: 900000 },
    ];

    await Movie.insertMany(movies);
    console.log('Films ajoutés à la base de données.');

    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors du peuplement de la base de données :', error);
    mongoose.connection.close();
  }
};

seedMovies();
