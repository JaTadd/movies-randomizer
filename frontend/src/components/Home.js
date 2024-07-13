// frontend/src/components/Home.js
import React from 'react';
import axios from 'axios';

function Home() {
  const getRandomMovie = async () => {
    const response = await axios.get('/api/movies/random-movie');
    alert(`Regardez ce film : ${response.data.title}`);
  };

  return (
    <div>
      <h1>Bienvenue</h1>
      <button onClick={getRandomMovie}>Choisir un film</button>
    </div>
  );
}

export default Home;

