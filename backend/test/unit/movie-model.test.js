const mongoose = require('mongoose');
const Movie = require('../../backend/models/Movie');

describe('Movie Model - Search Movies', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Movie.insertMany([
      { title: 'Inception', genres: ['Sci-Fi'], year: 2010},
      { title: 'Interstellar', genres: ['Sci-Fi'], year: 2014}
    ]);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should find movies matching the title', async () => {
    const movies = await Movie.find({ title: /Inception/i });
    expect(movies).toHaveLength(1);
    expect(movies[0].title).toBe('Inception');
  });
});
