import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CardSearch from "../components/CardSearch";

function SearchMovies() {
  const [title, setTitle] = useState("");
  const [movies, setMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWatchedMovies = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "http://localhost:5000/api/movies/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWatchedMovies(response.data);
      }
    };
    fetchWatchedMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/api/movies/search?title=${title}`
      );
      setMovies(response.data);
    } catch (error) {
      console.error("Error searching for movies:", error);
      alert("Error searching for movies");
    }
  };

  const markAsWatched = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/movies/mark-as-watched",
        { movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchedMovies([...watchedMovies, { _id: movieId }]);
      alert("Movie marked as watched");
    } catch (error) {
      console.error("Error marking movie as watched:", error);
      alert("Error marking movie as watched");
    }
  };

  const removeFromWatched = async (movieId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/movies/remove-from-watched",
        { movieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWatchedMovies(watchedMovies.filter((movie) => movie._id !== movieId));
      alert("Movie removed from watched list");
    } catch (error) {
      console.error("Error removing movie from watched list:", error);
      alert("Error removing movie from watched list");
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
