describe('E2E: Admin User', () => {
    let adminToken;
  
    afterAll(async () => {
      await new Promise((resolve) => server.close(resolve));
    });
  
    it('should log in as admin', async () => {
      const loginRes = await request(app)
        .post('/api/users/login')
        .send({
          email: 'admin@example.com',
          password: 'adminpassword',
        });
  
      expect(loginRes.status).toBe(200);
      adminToken = loginRes.body.token;
    });
  
    it('should allow admin to add a new movie', async () => {
      const addMovieRes = await request(app)
        .post('/api/movies/add-movie')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'New Admin Movie',
          genres: ['Drama'],
          year: 2023,
          image: 'imageurl.com',
        });
  
      expect(addMovieRes.status).toBe(201);
      expect(addMovieRes.text).toBe('Movie added');
    });
  });
  