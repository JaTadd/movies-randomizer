import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CardSearch from "../components/CardSearch";
import './SearchMovies.css';

function SearchMovies() {
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const navigate = useNavigate();

  // Mémoïriser handleSearch pour éviter les appels inutiles
  const handleSearch = useCallback(async () => {
    if (!title) return; // Ne pas faire de requête si le titre est vide
    try {
      const response = await axios.get(
        `http://localhost:5000/api/movies/search?title=${title}`
      );
      setMovies(response.data);
    } catch (error) {
      console.error("Error searching for movies:", error);
    }
  }, [title]);

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:5000/api/movies/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setWatchedMovies(response.data);
        } catch (error) {
          console.error("Error fetching watched movies:", error);
        }
      }
    };
    fetchWatchedMovies();
  }, []);

  useEffect(() => {
    handleSearch(); // Appelle handleSearch au montage du composant
  }, [handleSearch]); // Ajoute handleSearch dans les dépendances

  const markAsWatched = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/movies/mark-as-watched",
        { movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchedMovies([...watchedMovies, { _id: movieId }]);
    } catch (error) {
      console.error("Error marking movie as watched:", error);
    }
  };

  const removeFromWatched = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/movies/remove-from-watched",
        { movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchedMovies(watchedMovies.filter((movie) => movie._id !== movieId));
    } catch (error) {
      console.error("Error removing movie from watched list:", error);
    }
  };

  return (
    <div className="search-movies-container">
      <h1>Search Movies</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="search-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search by title"
          className="search-input"
          required
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      <div className="movies-grid">
        {movies.map((movie) => (
          <CardSearch
            key={movie._id}
            movie={movie}
            markAsWatched={markAsWatched}
            removeFromWatched={removeFromWatched}
            isWatched={watchedMovies.some(
              (watchedMovie) => watchedMovie._id === movie._id
            )}
          />
        ))}
      </div>
    </div>
  );
}

export default SearchMovies;
