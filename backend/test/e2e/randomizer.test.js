const request = require('supertest');
const app = require('../../server');

describe('E2E Test - Random Movie', () => {
  it('should return a random movie', async () => {
    const res = await request(app).get('/api/movies/random-movie?genres=Action');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body.genres).toContain('Action');
  });
});
