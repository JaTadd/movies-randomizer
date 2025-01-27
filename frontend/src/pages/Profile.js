import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';  
import CardProfile from '../components/CardProfile';

function Profile() {
  const [movies, setMovies] = useState([]); // Films vus par l'utilisateur
  const [recommendations, setRecommendations] = useState([]); // Films recommandés
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les films vus par l'utilisateur
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

  // Charger les recommandations
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (movies.length === 0) return; // Pas de films vus, pas de recommandations
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/movies/recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecommendations(response.data); // Enregistrer les recommandations
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError(err);
      }
    };
    fetchRecommendations();
  }, [movies]); // Appeler fetchRecommendations dès que les films vus sont chargés

  const handleDelete = async (movie) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/movies/remove-from-watched', 
        { movieId: movie._id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMovies(movies.filter(m => m._id !== movie._id));  // Supprimer le film de la liste
      alert('Movie removed from watched list');
    } catch (err) {
      console.error('Failed to remove movie from watched list:', err);
      alert('Failed to remove movie from watched list');
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
            onDelete={handleDelete}
          />
        ))}
      </div>

      <h2>Recommandations pour vous</h2>
      {recommendations.length > 0 ? (
        <div className="movies-grid">
          {recommendations.map((movieTitle, index) => (
            <div key={index} className="recommended-movie">
              {movieTitle}
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune recommandation pour le moment.</p>
      )}
    </div>
  );
}

export default Profile;
