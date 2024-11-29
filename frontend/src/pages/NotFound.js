import React from 'react';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/spiral.png';
import brightBrainLogo from '../assets/bright-brain-logo.webp';

function NotFound() {
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
        flexDirection: 'column',
        margin: 0,
        padding: 0,
    };

    const containerStyle = {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '10px',
        padding: '20px',
        width: '90%',
        maxWidth: '600px',
        color: 'white',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
    };

    const headerStyle = {
        color: 'white',
        marginBottom: '20px',
    };

    const textStyle = {
        fontSize: '1.2em',
        color: '#ccc',
        marginBottom: '20px',
    };

    const linkStyle = {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold',
    };

    const headerBoxStyle = {
      maxWidth: '600px', // Match width of the container
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
      minWidth: '600px', // Adjust width for the header box
    };
  
    const logoStyle = {
      width: '100px',
      height: '100px',
      marginRight: '15px',
    };
  
    const titleStyle = {
      margin: 0,
      fontSize: '2rem',
    };

    return (
        <div style={pageStyle}>
            <div style={headerBoxStyle}>
          <img src={brightBrainLogo} alt="Bright Brain Logo" style={logoStyle} />
          <h1 style={titleStyle}>Bright Brain</h1>
        </div>

            <div style={containerStyle}>
                <h2 style={headerStyle}>404 - Page Not Found</h2>
                <p style={textStyle}>The page you're looking for doesn't exist.</p>
                <Link to="/" style={linkStyle}>Go to Home</Link>
            </div>
        </div>
    );
}

export default NotFound;
