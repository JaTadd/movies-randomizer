const mongoose = require('mongoose');
const Movie = require('../../models/Movie');
const { app, server } = require('../../server'); // Importer app et server
require('dotenv').config();

// Démarrage du serveur pour les tests
beforeAll((done) => {
  server.listen(0, () => { 
    console.log(`Test server started on port ${server.address().port}`);
    done();
  });
});

afterAll(async () => {
  // Nettoyage et arrêt
  await mongoose.connection.close(); 
  await new Promise((resolve) => server.close(resolve));
  console.log('Test server stopped');
});

afterEach(async () => {
  await Movie.deleteMany(); // Supprime tous les films après chaque test
});

describe('Movie Model - Search Movies', () => {
  it('should find movies matching the title', async () => {
    await Movie.insertMany([
      { title: 'Inception', genres: ['Sci-Fi'], year: 2010 },
      { title: 'Interstellar', genres: ['Sci-Fi'], year: 2014 },
    ]);

    const movies = await Movie.find({ title: /Inception/i });
    expect(movies).toHaveLength(1);
    expect(movies[0].title).toBe('Inception');
  });
});
