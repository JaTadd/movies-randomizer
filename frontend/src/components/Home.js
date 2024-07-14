import React from 'react';
import axios from 'axios';

function Home() {
  const getRandomMovie = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get('http://localhost:5000/api/movies/random-movie', { headers });
      console.log(response)
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
      <br />
      <a href="/search">Search Movies</a>
    </div>
  );
}

export default Home;
