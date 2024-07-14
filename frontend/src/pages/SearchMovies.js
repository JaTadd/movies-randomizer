// src/SearchMovies.js
import React, { useState } from 'react';
import axios from 'axios';
import CardSearch from '../components/CardSearch';

function SearchMovies() {
  const [title, setTitle] = useState('');
  const [movies, setMovies] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/movies/search?title=${title}`);
      setMovies(response.data);
    } catch (error) {
      console.error('Error searching for movies:', error);
      alert('Error searching for movies');
    }
  };

  const markAsWatched = async (movieId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/movies/mark-as-watched', 
        { movieId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Movie marked as watched');
    } catch (error) {
      console.error('Error marking movie as watched:', error);
      alert('Error marking movie as watched');
    }
  };

  return (
    <div>
      <h1>Search Movies</h1>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Search by title" 
          required 
        />
        <button type="submit">Search</button>
      </form>
      <div className="movies-grid">
        {movies.map((movie) => (
          <CardSearch 
            key={movie._id}
            movie={movie}
            markAsWatched={markAsWatched}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchMovies;
