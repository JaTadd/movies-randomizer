import React from 'react';
import './CardSearch.css'; 

function CardSearch({ movie, markAsWatched, removeFromWatched, isWatched }) {
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
          {isWatched ? (
            <button onClick={() => removeFromWatched(movie._id)}>Retirer de la liste</button>
          ) : (
            <button onClick={() => markAsWatched(movie._id)}>Déjà vu</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardSearch;
