import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    axiosInstance.post('/api/register/', {
      username,
      email,
      password,
    })
      .then((response) => {
        alert('Registration successful!');
        navigate('/login');
      })
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.data) {
          alert('Registration Failed: ' + JSON.stringify(error.response.data));
        } else {
          alert('Registration Failed');
        }
      });
  };

  // Inline styles
  const containerStyle = {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f9f9f9',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
  };

  const linkStyle = {
    color: '#4CAF50',
    textDecoration: 'none',
  };

  const textCenterStyle = {
    textAlign: 'center',
    marginTop: '10px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>Register</button>
      </form>
      <p style={textCenterStyle}>
        Already have an account? <Link to="/login" style={linkStyle}>Login here</Link>
      </p>
    </div>
  );
}

export default Register;
