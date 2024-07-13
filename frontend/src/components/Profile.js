// frontend/src/components/Profile.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/movies/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(response.data);
    };
    fetchMovies();
  }, []);

  return (
    <div>
      <h1>Vos films vus</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie._id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
