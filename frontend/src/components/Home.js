import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const getRandomMovie = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies/random-movie');
      alert(`Regardez ce film : ${response.data.title}`);
    } catch (error) {
      console.error('Error fetching the movie:', error);
      alert('Error fetching the movie');
    }
  };

  return (
    <div>
      <h1>Bienvenue</h1>
      <button onClick={getRandomMovie}>Choisir un film</button>
    </div>
  );
}

export default Home;
