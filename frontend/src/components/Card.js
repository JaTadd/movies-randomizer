// src/components/Card.js
import React from 'react';
import './Card.css';

function Card({ title, year, genre, image, isWatched, onMarkAsWatched, onRemoveFromWatched }) {
  return (
    <div className="card-profile">
      <img src={image} alt={title} className="card-profile-image" />
      <div className="card-profile-info">
        <h2 className="card-profile-title">{title}</h2>
        <p className="card-profile-details">Année: {year}</p>
        <p className="card-profile-details">Genre: {genre}</p>
        <div className="card-profile-actions">
          {isWatched ? (
            <button onClick={onRemoveFromWatched} className="card-profile-button">Retirer de la liste</button>
          ) : (
            <button onClick={onMarkAsWatched} className="card-profile-button">Déjà vu</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
