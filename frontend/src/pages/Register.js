import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import backgroundImage from '../assets/spiral.png';
import brightBrainLogo from '../assets/bright-brain-logo.webp';

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

  const pageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  };

  const containerStyle = {
    maxWidth: '500px', // Increased width
    padding: '30px', // Increased padding
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    textAlign: 'center',
  };

  const inputStyle = {
    width: '90%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #444',
    backgroundColor: '#222',
    color: '#fff',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: '10px',
    fontSize: '15px', // Adjust font size for the button
  };

  const linkStyle = {
    color: '#007BFF',
    textDecoration: 'none',
  };

  const headerBoxStyle = {
    maxWidth: '500px', // Match width of the container
    marginBottom: '20px',
    padding: '30px', // Increased padding for spacing
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    minHeight: '100px', // Adjust height for the header box
    minWidth: '500px', // Adjust width for the header box
  };

  const logoStyle = {
    width: '100px',
    height: '100px',
    marginRight: '15px', // Space between image and text
  };

  const titleStyle = {
    margin: 0,
    fontSize: '2rem', // Adjust font size for the title
  };

  return (
    <div style={pageStyle}>
      <div>
        <div style={headerBoxStyle}>
          <img src={brightBrainLogo} alt="Bright Brain Logo" style={logoStyle} />
          <h1 style={titleStyle}>Bright Brain</h1>
        </div>
        <div style={containerStyle}>
          <h1 style={{ textAlign: 'center', color: '#fff' }}>Register:</h1>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              className="input-field"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              className="input-field"
            />
            <button
              type="submit"
              style={buttonStyle}
              className="btn"
            >
              Register
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Already have an account? <Link to="/login" style={linkStyle}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
