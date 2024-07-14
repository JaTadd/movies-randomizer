// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
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
              <Link to="/profile">Profile</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
