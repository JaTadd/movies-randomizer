const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/movieDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

// Démarrage du serveur
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
