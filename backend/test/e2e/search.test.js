const request = require('supertest');
const app = require('../../server');

describe('E2E Test - Search Movie by Title', () => {
  it('should return movies matching the title query', async () => {
    const res = await request(app).get('/api/movies/search?title=Inception');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty('title', expect.stringMatching(/Inception/i));
  });

  it('should return 400 if title is not provided', async () => {
    const res = await request(app).get('/api/movies/search');
    expect(res.status).toBe(400);
    expect(res.text).toBe('Title is required');
  });
});
