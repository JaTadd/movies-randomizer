import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';  
import CardProfile from '../components/CardProfile';

function Profile() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/movies/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMovies(response.data);
      } catch (err) {
        console.error('Failed to fetch movies:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  const handleDelete = async (movie) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/movies/${movie._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMovies(movies.filter(m => m._id !== movie._id));  // Remove the movie from the list
    } catch (err) {
      console.error('Failed to delete movie:', err);
      // Optionally handle the error, e.g., show an error message
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading movies!</p>;

  return (
    <div className="profile-container">
      <h1>Vos films vus</h1>
      <div className="movies-grid">
        {movies.map((movie) => (
          <CardProfile 
            key={movie._id}
            movie={movie}
            onDelete={() => handleDelete(movie)}
          />
        ))}
      </div>
    </div>
  );
}



export default Profile;
