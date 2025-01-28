const request = require('supertest');
const { app, server } = require('../../server');
const mongoose = require('mongoose');
const Movie = require('../../models/Movie');

// Utilisez uniquement la base de données de test
beforeAll(async () => {
  const mongoTestURI = process.env.MONGO_URI_TEST;

  if (!mongoTestURI) {
    throw new Error('MONGO_URI_TEST non défini. Vérifiez votre fichier .env.');
  }

  // Connexion à la base de test
  await mongoose.connect(mongoTestURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Connecté à la base de test.');
});

afterAll(async () => {
  console.log('Fermeture des connexions...');
  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
});

// Aucune opération de suppression ou nettoyage automatique ici
const seedDatabase = async () => {
  // Vérifiez que nous travaillons bien sur une base de test
  if (mongoose.connection.name !== 'MovieRandomizerTest') {
    console.warn('Pas de seed : vous n’êtes pas connecté à la base de test.');
    return;
  }

  console.log('Ajout de films de test...');
  await Movie.insertMany([
    { title: 'Inception', genres: ['Sci-Fi'], year: 2010 },
    { title: 'Interstellar', genres: ['Sci-Fi'], year: 2014 },
  ]);
  console.log('Films ajoutés.');
};

// Scénario E2E : Nouvel utilisateur
describe('E2E: Nouvel Utilisateur', () => {
  let token;

  beforeAll(async () => {
    await seedDatabase();
  });

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
      .get('/api/movies/random-movie-auth')
      .set('Authorization', `Bearer ${token}`);

    console.log('Random Movie:', randomizeRes.body);
    expect(randomizeRes.status).toBe(200);
    expect(randomizeRes.body).toHaveProperty('title');
  });

  it('should add a random movie to the watchlist', async () => {
    const movie = await request(app)
      .get('/api/movies/random-movie-auth')
      .set('Authorization', `Bearer ${token}`);

    const addToWatchlistRes = await request(app)
      .post('/api/movies/mark-as-watched')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: movie.body._id });

    console.log('Add to Watchlist Response:', addToWatchlistRes.body);
    expect(addToWatchlistRes.status).toBe(200);
    expect(addToWatchlistRes.text).toBe('Movie marked as watched');
  });

  it('should retrieve the user\'s watchlist', async () => {
    const watchlistRes = await request(app)
      .get('/api/movies/profile')
      .set('Authorization', `Bearer ${token}`);

    console.log('Watchlist:', watchlistRes.body);
    expect(watchlistRes.status).toBe(200);
    expect(watchlistRes.body).toBeInstanceOf(Array);
    expect(watchlistRes.body.length).toBeGreaterThan(0);
    expect(watchlistRes.body[0]).toHaveProperty('title');
  });
});
