const request = require('supertest');
const app = require('../../backend/server');

describe('E2E Test - Watchlist Management', () => {
  let token;

  beforeAll(async () => {
    const loginRes = await request(app).post('/api/users/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });

    token = loginRes.body.token;
  });

  it('should add a movie to the watchlist', async () => {
    const addMovieRes = await request(app)
      .post('/api/movies/mark-as-watched')
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: 'movie123' });

    expect(addMovieRes.status).toBe(200);
    expect(addMovieRes.text).toBe('Movie marked as watched');
  });
});
