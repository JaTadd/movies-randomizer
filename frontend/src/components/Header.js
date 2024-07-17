// src/components/Header.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const username = localStorage.getItem("username"); // Récupérer le username

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("username"); // Supprimer le username

    navigate("/");
  };

  return (
    <header>
      <nav>
        <div className="nav-left">
          <Link to="/">
            <img
              src="https://purepng.com/public/uploads/large/purepng.com-bananafruitsyellowfruitbanana-981524754691bawpo.png"
              alt="Home"
              style={{ height: "40px", width: "40px" }}
            />
          </Link>
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
              <Link to="/profile">{username}</Link>
              {isAdmin && <Link to="/admin">Admin</Link>}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
