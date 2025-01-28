describe('E2E: Ancien Utilisateur', () => {
    let token;
  
    afterAll(async () => {
      await new Promise((resolve) => server.close(resolve));
    });
  
    it('should log in an existing user', async () => {
      const loginRes = await request(app)
        .post('/api/users/login')
        .send({
          email: 'existinguser@example.com',
          password: 'password123',
        });
  
      expect(loginRes.status).toBe(200);
      token = loginRes.body.token;
    });
  
    it('should remove a movie from the user’s watchlist', async () => {
      const userRes = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);
  
      const movieId = userRes.body.watchList[0]; // Suppose qu’un film est déjà présent
  
      const removeRes = await request(app)
        .delete(`/api/users/watchlist/${movieId}`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(removeRes.status).toBe(200);
      expect(removeRes.text).toBe('Movie removed from watchlist');
    });
  });
  