const request = require('supertest');
const { app, server } = require('../../server'); // Importer app et server
const mongoose = require('mongoose');

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

describe('Movie Search Route', () => {
  it('should return movies matching the title', async () => {
    const res = await request(server).get('/api/movies/search?title=Inception');

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0].title).toBe('Inception');
  });

  it('should return 400 if title is not provided', async () => {
    const res = await request(server).get('/api/movies/search');

    expect(res.status).toBe(400);
    expect(res.text).toBe('Title is required');
  });
});

