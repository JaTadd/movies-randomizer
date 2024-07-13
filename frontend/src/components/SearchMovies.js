import React, { useState } from 'react';
import axios from 'axios';

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
    await axios.post('http://localhost:5000/api/movies/mark-as-watched', 
      { movieId }, 
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Movie marked as watched');
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
      <ul>
        {movies.map(movie => (
          <li key={movie._id}>
            {movie.title} ({movie.year})
            <button onClick={() => markAsWatched(movie._id)}>Mark as Watched</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchMovies;
