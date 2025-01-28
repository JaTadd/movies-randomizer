const mongoose = require('mongoose');
const Movie = require('../../models/Movie');
const { app, server } = require('../../server'); // Importer app et server
require('dotenv').config();
console.log('MONGO_URI_TEST:', process.env.MONGO_URI_TEST);

// Nettoyage global avant tous les tests
beforeAll(async () => {
  // Démarrage du serveur
  server.listen(0, () => {
    console.log(`Test server started on port ${server.address().port}`);
  });

  // Connexion à MongoDB et vidage de toutes les collections
  await mongoose.connection.dropDatabase();
  console.log('Database cleaned before all tests');
});

afterAll(async () => {
  // Fermeture du serveur et de la base de données
  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
  console.log('Test server stopped');
});

// Ajout d'un nettoyage après chaque test
afterEach(async () => {
  await Movie.deleteMany(); // Supprime tous les documents spécifiques aux films
});

describe('Movie Model - Search Movies', () => {
  it('should find movies matching the title', async () => {
    await Movie.insertMany([
      { title: 'Inception', genres: ['Sci-Fi'], year: 2010 },
    ]);

    const movies = await Movie.find({ title: /Inception/i });
    expect(movies).toHaveLength(1); // Vérifie qu'un seul document existe
    expect(movies[0].title).toBe('Inception');
  });
});
