// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const username = localStorage.getItem('username'); // Récupérer le username
  console.log(username)




  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('username'); // Supprimer le username

    navigate('/');
  };

  return (
    <header>
      <nav>
        <div className="nav-left">
          <Link to="/">Home</Link>
          <Link to="/search">Search Movies</Link>
        </div>
        <div className="nav-right">
          {!token ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/profile">{username}</Link> {/* Afficher et lier le username */}
              {isAdmin && <Link to="/admin">Admin</Link>}  {/* Lien vers Admin */}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
