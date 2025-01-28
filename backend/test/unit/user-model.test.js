const mongoose = require('mongoose');
const User = require('../../models/User');
const { app, server } = require('../../server'); // Importer app et server

// Démarrage du serveur pour les tests
beforeAll((done) => {
  server.listen(0, () => {
    console.log(`Test server started on port ${server.address().port}`);
    done();
  });
});

afterAll(async () => {
  // Nettoyage et arrêt
  await mongoose.connection.close();
  await new Promise((resolve) => server.close(resolve));
  console.log('Test server stopped');
});

afterEach(async () => {
  await User.deleteMany(); // Supprime tous les utilisateurs après chaque test
});

describe('User Model - Add User', () => {
  it('should save a user with valid fields', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe('testuser');
    expect(savedUser.email).toBe('test@example.com');
    expect(savedUser.isAdmin).toBe(false);
  });

  it('should not save a user with a duplicate email', async () => {
    const user1 = new User({
      username: 'user1',
      email: 'duplicate@example.com',
      password: 'password123',
    });

    const user2 = new User({
      username: 'user2',
      email: 'duplicate@example.com',
      password: 'password123',
    });

    await user1.save();
    await expect(user2.save()).rejects.toThrow(
      /E11000 duplicate key error collection/
    );
  });
});
