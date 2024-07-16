//src/components/Card.js
import React from 'react';
import './Card.css'; // Assurez-vous que les styles sont appropriés

function Card({ title, year, genre, image, isWatched, onMarkAsWatched, onRemoveFromWatched }) {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-year">Année: {year}</p>
        <p className="card-genre">Genre: {genre}</p>
        {isWatched ? (
          <button onClick={onRemoveFromWatched} className="card-remove-from-watched">Retirer de la liste</button>
        ) : (
          <button onClick={onMarkAsWatched} className="card-add-to-watched">Déjà vu</button>
        )}
      </div>
    </div>
  );
}

export default Card;
