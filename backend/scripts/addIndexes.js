const mongoose = require('mongoose');
const Movie = require('../models/Movie'); 
async function addIndexes() {
  try {
    await mongoose.connect('mongodb://localhost:27017/movieDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    await Movie.collection.createIndex({ title: 1 });
    await Movie.collection.createIndex({ genres: 1 });
    await Movie.collection.createIndex({ year: 1 });
    await Movie.collection.createIndex({ IMDBRating: 1 });

    console.log('Indexes created successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating indexes:', error);
    mongoose.connection.close();
  }
}

addIndexes();
