const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Inscription
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).send('User created');
  } catch (error) {
    console.error('Error creating user:', error); 
    res.status(400).send('Error creating user: ' + error.message);
  }
});

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin, username: user.username }, 'secret_key');
    res.json({ token, isAdmin: user.isAdmin, username: user.username });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

module.exports = router;
