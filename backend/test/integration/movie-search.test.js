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
  await mongoose.connection.close(); // Fermez MongoDB proprement
  await new Promise((resolve) => server.close(resolve)); // Assurez-vous que le serveur est complètement arrêté
  console.log('Test server stopped'); // Ce log ne devrait plus poser problème
});

describe('Movie Search Route', () => {
  it('should return movies matching the title', async () => {
    const res = await request(server).get('/api/movies/search?title=Inception');
    
    console.log('Response body:', res.body); 
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    
    expect(res.body.length).toBeGreaterThan(0);
  
    expect(res.body[0]).toHaveProperty('title', 'Inception');
  });
});

