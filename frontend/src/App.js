import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import SearchMovies from "./pages/SearchMovies";
import AdminPage from "./pages/AdminPage";
import Header from "./components/Header";
import ChatSlider from "./components/ChatSlider";

function App() {
  return (
    <Router>
      <Header /> {/* Inclure le Header */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchMovies />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <ChatSlider />
    </Router>
  );
}

export default App;
