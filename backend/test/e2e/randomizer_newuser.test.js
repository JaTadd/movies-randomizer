const request = require('supertest');
const { app, server } = require('../../server');
const mongoose = require('mongoose');
const Movie = require('../../models/Movie');
const User = require('../../models/User');

beforeAll(async () => {
  await mongoose.connection.dropDatabase(); // Nettoyage de la base
  console.log('Database cleared for testing');

  // Ajout de films pour le randomizer
  await Movie.insertMany([
    { title: 'Inception', genres: ['Sci-Fi'], year: 2010 },
    { title: 'Interstellar', genres: ['Sci-Fi'], year: 2014 },
  ]);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
});

describe('E2E: Nouvel Utilisateur', () => {
  let token;

  it('should allow a new user to sign up', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(201);
    expect(res.text).toBe('User created');
  });

  it('should log in the new user and randomize a movie', async () => {
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'newuser@example.com',
        password: 'password123',
      });

    expect(loginRes.status).toBe(200);
    token = loginRes.body.token;

    const randomizeRes = await request(app)
      .get('/api/movies/random')
      .set('Authorization', `Bearer ${token}`);

    console.log('Random Movie:', randomizeRes.body);
    expect(randomizeRes.status).toBe(200);
    expect(randomizeRes.body).toHaveProperty('title');
  });

  it('should add a random movie to the watchlist', async () => {
    const movie = await request(app)
      .get('/api/movies/random')
      .set('Authorization', `Bearer ${token}`);

    const addToWatchlistRes = await request(app)
      .post('/api/users/watchlist')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: movie.body._id });

    console.log('Add to Watchlist Response:', addToWatchlistRes.body);
    expect(addToWatchlistRes.status).toBe(200);
    expect(addToWatchlistRes.text).toBe('Movie added to watchlist');
  });
});
