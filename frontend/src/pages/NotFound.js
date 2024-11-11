import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>404 - Page Not Found</h2>
      <p style={textStyle}>The page you're looking for doesn't exist.</p>
      <Link to="/" style={linkStyle}>Go to Home</Link>
    </div>
  );
}

// Inline styles
const containerStyle = {
  maxWidth: '400px',
  margin: '50px auto',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#f9f9f9',
  textAlign: 'center',
};

const headerStyle = {
  color: '#333',
  textAlign: 'center',
  marginBottom: '20px',
};

const textStyle = {
  fontSize: '1.2em',
  color: '#555',
  marginBottom: '20px',
};

const linkStyle = {
  color: '#4CAF50',
  textDecoration: 'none',
  fontWeight: 'bold',
};

export default NotFound;
