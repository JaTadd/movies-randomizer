const request = require('supertest');
const app = require('../../server');

describe('Admin Access Route', () => {
  it('should deny access to non-admin users', async () => {
    const token = 'fake-non-admin-token'; // Simuler un token non admin

    const res = await request(app)
      .post('/api/movies/add-movie')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Movie', genre: ['Action'], year: 2023 });

    expect(res.status).toBe(403);
    expect(res.text).toBe('Access denied. Admins only.');
  });
});
