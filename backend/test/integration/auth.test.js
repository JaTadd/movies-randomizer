const jwt = require('jsonwebtoken');
const request = require('supertest');
const { app, server } = require('../../server');
const mongoose = require('mongoose');
const User = require('../../models/User'); 
require('dotenv').config();

console.log('MONGO_URI_TEST:', process.env.MONGO_URI_TEST);

beforeEach(async () => {
  await User.deleteMany({});
});

beforeAll((done) => {
  server.listen(0, () => {
    console.log(`Test server started on port ${server.address().port}`);
    done();
  });
});

afterAll(async () => {
  await mongoose.connection.close(); // Fermez MongoDB
  server.close(); // Arrêtez le serveur
});
describe('User Signup Route', () => {
  it('should register a new user', async () => {
    const res = await request(server)
      .post('/api/users/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

    console.log('Response body:', res.body);
    expect(res.status).toBe(201);
    expect(res.text).toBe('User created');
  });

  it('should return 400 if fields are missing', async () => {
    const res = await request(server)
      .post('/api/users/signup')
      .send({
        username: '', // Champ invalide
        email: 'test@example.com',
      });

    console.log('Response body:', res.body);
    expect(res.status).toBe(400);
    expect(res.text).toBe('All fields are required');
  });

  it('should allow an admin user to create a token and access protected routes', async () => {
    const token = jwt.sign(
      { userId: 'fakeUserId', isAdmin: true }, 
      'secret_key', 
      { expiresIn: '1h' }
    );

    const res = await request(server)
      .post('/api/movies/add-movie')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Admin Created Movie',
        genre: ['Action'],
        year: 2023,
        image: 'example.jpg',
      });

    expect(res.status).toBe(201);
    expect(res.text).toBe('Movie added');
  });
});


