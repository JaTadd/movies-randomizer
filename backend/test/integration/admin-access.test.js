const request = require('supertest');
const { app, server } = require('../../server'); // Importer app et server
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


beforeAll((done) => {
  server.listen(0, () => { // 0 permet d'attribuer un port libre automatiquement
    console.log(`Test server started on port ${server.address().port}`);
    done();
  });
});

afterAll(async () => {
  await mongoose.connection.close(); // Fermez MongoDB
  server.close(() => {
    console.log('Test server stopped');
  });
});

describe('Admin Access Route', () => {
  it('should deny access to non-admin users', async () => {
    const token = jwt.sign({ userId: 'fakeUserId', isAdmin: false }, 'secret_key'); // Générer un token JWT valide

    const res = await request(server)
      .post('/api/movies/add-movie')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Movie', genre: ['Action'], year: 2023, image: 'yahoo' });

    expect(res.status).toBe(403);
    expect(res.text).toBe('Access denied. Admins only.');
  });
});

