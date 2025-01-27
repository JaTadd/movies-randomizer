const request = require('supertest');
const app = require('../../backend/server');

describe('User Signup Route', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/users/signup').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.text).toBe('User created');
  });

  it('should return 400 if fields are missing', async () => {
    const res = await request(app).post('/api/users/signup').send({
      username: '',
      email: 'testuser@example.com',
    });

    expect(res.status).toBe(400);
    expect(res.text).toBe('All fields are required');
  });
});
