import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/movies/add-movie', 
        { title, genre, year, image },  // Inclure image ici
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Movie added successfully');
      navigate('/');
    } catch (error) {
      console.error('Error adding movie:', error);
      alert('Error adding movie');
    }
  };

  return (
    <div>
      <h1>Add a New Movie</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Title" 
          required 
        />
        <input 
          type="text" 
          value={genre} 
          onChange={(e) => setGenre(e.target.value)} 
          placeholder="Genre" 
          required 
        />
        <input 
          type="number" 
          value={year} 
          onChange={(e) => setYear(e.target.value)} 
          placeholder="Year" 
          required 
        />
        <input 
          type="text" 
          value={image} 
          onChange={(e) => setImage(e.target.value)} 
          placeholder="Image URL" 
        />
        <button type="submit">Add Movie</button>
      </form>
    </div>
  );
}

export default AdminPage;
