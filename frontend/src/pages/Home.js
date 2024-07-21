import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import './Home.css';


const genresOptions = [
  { value: 'Reality-TV', label: 'Reality-TV' },
  { value: 'Animation', label: 'Animation' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Sci-Fi', label: 'Sci-Fi' },
  { value: 'Family', label: 'Family' },
  { value: 'Horror', label: 'Horror' },
  { value: '\\N', label: '\\N' },
  { value: 'Music', label: 'Music' },
  { value: 'Western', label: 'Western' },
  { value: 'Film-Noir', label: 'Film-Noir' },
  { value: 'Drama', label: 'Drama' },
  { value: 'Comedy', label: 'Comedy' },
  { value: 'Game-Show', label: 'Game-Show' },
  { value: 'Documentary', label: 'Documentary' },
  { value: 'Romance', label: 'Romance' },
  { value: 'War', label: 'War' },
  { value: 'Biography', label: 'Biography' },
  { value: 'Crime', label: 'Crime' },
  { value: 'Adult', label: 'Adult' },
  { value: 'News', label: 'News' },
  { value: 'Short', label: 'Short' },
  { value: 'History', label: 'History' },
  { value: 'Musical', label: 'Musical' },
  { value: 'Action', label: 'Action' },
  { value: 'Thriller', label: 'Thriller' },
  { value: 'Fantasy', label: 'Fantasy' },
  { value: 'Sport', label: 'Sport' },
  { value: 'Mystery', label: 'Mystery' },
  { value: 'Talk-Show', label: 'Talk-Show' }
];

const ratingOptions = [
  { value: 0, label: '0' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
];

const popularityOptions = [
  { value: 0, label: 'Mini banana' },
  { value: 800, label: 'Lil banana' },
  { value: 1500, label: 'Mid banana' },
  { value: 3500, label: 'Big banana' },
  { value: 300000, label: 'Gozibanana' }
];

function Home() {
  const [movie, setMovie] = useState(null);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedPopularity, setSelectedPopularity] = useState(null);
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
      const genres = selectedGenres.map(genre => genre.value).join(',');
      const rating = selectedRating ? selectedRating.value : '';
      const popularity = selectedPopularity ? selectedPopularity.value : '';
      const response = await axios.get(`http://localhost:5000/api/movies/random-movie?genres=${genres}&rating=${rating}&popularity=${popularity}`);
      setMovie(response.data);
    } catch (error) {
      console.error('Error fetching the movie:', error);
      //alert('Error fetching the movie');
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
      //alert('Movie marked as watched');
    } catch (error) {
      console.error('Error marking movie as watched:', error);
      //alert('Error marking movie as watched');
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
      //alert('Movie removed from watched list');
    } catch (error) {
      console.error('Error removing movie from watched list:', error);
      //alert('Error removing movie from watched list');
    }
  };

  return (
    <div className="home-container">
      <h1>Bienvenue sur BananaFlix</h1>
      <div className="select-container">
        <Select
          isMulti
          name="genres"
          options={genresOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={setSelectedGenres}
          placeholder="Sélectionner des genres"
        />
        <Select
          name="rating"
          options={ratingOptions}
          className="basic-single-select"
          classNamePrefix="select"
          onChange={setSelectedRating}
          placeholder="Sélectionner une note minimale"
        />
        <Select
          name="popularity"
          options={popularityOptions}
          className="basic-single-select"
          classNamePrefix="select"
          onChange={setSelectedPopularity}
          placeholder="Sélectionner une popularité"
        />
        <button className="select-button" onClick={getRandomMovie}>Choisir un film</button>
      </div>
      
      {movie && (
        <div className="movie-card-container">
          <Card 
            title={movie.title} 
            year={movie.year} 
            genre={movie.genres.join(', ')} 
            image={movie.image}
            isWatched={watchedMovies.some(watchedMovie => watchedMovie._id === movie._id)}
            onMarkAsWatched={() => markAsWatched(movie._id)}
            onRemoveFromWatched={() => removeFromWatched(movie._id)}
          />
        </div>
      )}
    </div>
  );
}

export default Home;