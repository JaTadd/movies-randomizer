// src/components/CardSearch.js
import React from 'react';
import './CardSearch.css'; 

function CardSearch({ movie, markAsWatched }) {
  if (!movie) return null; 

  return (
    <div className="card-profile">
      <img src={movie.image} alt={movie.title} className="card-profile-image" />
      <div className="card-profile-info">
        <h2 className="card-profile-title">{movie.title}</h2>
        <p className="card-profile-details">
          {movie.genre} - {movie.year}
        </p>
        <div className="card-profile-actions">
          <button onClick={() => console.log('Add to watchlist', movie.title)}>Ajouter à la watchlist</button>
          <button onClick={() => markAsWatched(movie._id)}>Déjà vu</button>
        </div>
      </div>
    </div>
  );
}

export default CardSearch;
