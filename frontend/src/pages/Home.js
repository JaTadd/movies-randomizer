//src/pages/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [movie, setMovie] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/movies/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWatchedMovies(response.data);
      }
    };
    fetchWatchedMovies();
  }, []);

  const getRandomMovie = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies/random-movie');
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching the movie:', error);
      alert('Error fetching the movie');
    }
  };

  const markAsWatched = async (movieId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/movies/mark-as-watched', 
        { movieId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchedMovies([...watchedMovies, { _id: movieId }]);
      alert('Movie marked as watched');
    } catch (error) {
      console.error('Error marking movie as watched:', error);
      alert('Error marking movie as watched');
    }
  };

  const removeFromWatched = async (movieId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/movies/remove-from-watched', 
        { movieId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchedMovies(watchedMovies.filter(movie => movie._id !== movieId));
      alert('Movie removed from watched list');
    } catch (error) {
      console.error('Error removing movie from watched list:', error);
      alert('Error removing movie from watched list');
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
          isWatched={watchedMovies.some(watchedMovie => watchedMovie._id === movie._id)}
          onMarkAsWatched={() => markAsWatched(movie._id)}
          onRemoveFromWatched={() => removeFromWatched(movie._id)}
        />
      )}
    </div>
  );
}

export default Home;
