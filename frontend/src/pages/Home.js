// src/Home.js
import React, { useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';

function Home() {
  const [movie, setMovie] = useState(null);

  const getRandomMovie = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies/random-movie');
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching the movie:', error);
      alert('Error fetching the movie');
    }
  };

  return (
    <div>
      <h1>Bienvenue</h1>
      <button onClick={getRandomMovie}>Choisir un film</button>

      {movie && (
        <Card 
          title={movie.title} 
          year={movie.year} 
          genre={movie.genre} 
          image={movie.image} 
        />
      )}
    </div>
  );
}

export default Home;
