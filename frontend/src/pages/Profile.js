import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';  
import CardProfile from '../components/CardProfile';

function Profile() {
  const [movies, setMovies] = useState([]); // Films vus par l'utilisateur
  const [recommendations, setRecommendations] = useState([]); // Films recommandés
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
>>>>>>> origin/dev
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
<<<<<<< HEAD
        console.error('Failed to fetch movies:', err);
=======
        console.error('❌ Erreur récupération films vus:', err);
>>>>>>> origin/dev
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

<<<<<<< HEAD
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
=======
  // Fonction pour charger les recommandations quand l'utilisateur clique
  const fetchRecommendations = async () => {
    if (movies.length === 0) {
      setError("Ajoutez des films avant d'obtenir des recommandations.");
      return;
    }

    setLoadingRecommendations(true);
    setError(null);
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:5000/api/movies/recommendations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecommendations(response.data);
    } catch (err) {
      console.error('❌ Erreur récupération recommandations:', err);
      setError("Erreur lors de la récupération des recommandations.");
    } finally {
      setLoadingRecommendations(false);
    }
  };
>>>>>>> origin/dev

  const handleDelete = async (movie) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/movies/remove-from-watched', 
        { movieId: movie._id }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMovies(movies.filter(m => m._id !== movie._id));  // Supprimer le film de la liste
<<<<<<< HEAD
      alert('Movie removed from watched list');
    } catch (err) {
      console.error('Failed to remove movie from watched list:', err);
      alert('Failed to remove movie from watched list');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading movies!</p>;
=======
      alert('Film supprimé de votre liste.');
    } catch (err) {
      console.error('❌ Erreur suppression film:', err);
      alert('Échec de la suppression du film.');
    }
  };

  if (loading) return <p>Chargement des films vus...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
>>>>>>> origin/dev

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
<<<<<<< HEAD
=======
      
      <button onClick={fetchRecommendations} disabled={loadingRecommendations}>
        {loadingRecommendations ? "Chargement..." : "Générer des recommandations"}
      </button>

>>>>>>> origin/dev
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
