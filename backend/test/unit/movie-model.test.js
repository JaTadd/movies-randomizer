const mongoose = require('mongoose');
const Movie = require('../../backend/models/Movie');

describe('Movie Model - Search Movies', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase(); // Nettoie la base de test.
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await Movie.deleteMany(); // Supprime les films après chaque test.
  });

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
