import React from 'react';
import './CardProfile.css'; 

function CardProfile({ movie, onDelete }) {
  return (
    <div className="card-profile">
      <img src={movie.image} alt={movie.title} className="card-profile-image" />
      <div className="card-profile-info">
        <h2 className="card-profile-title">{movie.title}</h2>
        <p className="card-profile-details">
          {movie.genre} - {movie.year}
        </p>
        <div className="card-profile-actions">
          <button onClick={() => onDelete(movie)}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

export default CardProfile;
