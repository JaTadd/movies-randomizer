import React from 'react';
import './Card.css'; // Assurez-vous que les styles sont appropriés

function Card({ title, year, genre, image, onAddToWatchlist }) {
  return (
    <div className="card">
      <img src={image} alt={title} className="card-image" />
      <div className="card-content">
        <h2 className="card-title">{title}</h2>
        <p className="card-year">Année: {year}</p>
        <p className="card-genre">Genre: {genre}</p>
        <button onClick={onAddToWatchlist} className="card-add-to-watchlist">Ajouter à la watchlist</button>
      </div>
    </div>
  );
}

export default Card;
