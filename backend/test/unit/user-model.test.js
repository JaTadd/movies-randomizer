const mongoose = require('mongoose');
const User = require('../../models/User');

describe('User Model - Add User', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase(); // Nettoie la base après les tests.
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany(); // Supprime les utilisateurs après chaque test.
  });

  it('should save a user with valid fields', async () => {
    const user = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe('testuser');
    expect(savedUser.isAdmin).toBe(false);
  });

  it('should not save a user with a duplicate email', async () => {
    const user1 = new User({
      username: 'user1',
      email: 'duplicate@example.com',
      password: 'password123',
    });
    await user1.save();

    const user2 = new User({
      username: 'user2',
      email: 'duplicate@example.com',
      password: 'password456',
    });

    await expect(user2.save()).rejects.toThrow(); // Vérifie que l'erreur est levée.
  });
});
