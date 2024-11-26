import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import backgroundImage from '../assets/spiral.png';
import brightBrainLogo from '../assets/bright-brain-logo.webp';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [apiCalls, setApiCalls] = useState(0);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [userList, setUserList] = useState([]);
  const [endpointStats, setEndpointStats] = useState([]);
  const [userApiConsumption, setUserApiConsumption] = useState([]);
  const navigate = useNavigate();
  let alertShown = false;

  useEffect(() => {
    axiosInstance.get('/api/user/')
      .then((response) => {
        setUsername(response.data.username);
        setApiCalls(response.data.api_calls);
        setIsSuperuser(response.data.is_superuser);

        if (!response.data.is_superuser && response.data.api_calls > 20 && !alertShown) {
          alert('You have exceeded your 20 API calls');
          alertShown = true;
        }

        if (response.data.is_superuser) {
          axiosInstance.get('/api/users/')
            .then((res) => setUserList(res.data))
            .catch((error) => alert('Failed to fetch user list'));

          axiosInstance.get('/api/endpoint-stats/')
            .then((res) => setEndpointStats(res.data))
            .catch((error) => alert('Failed to fetch endpoint stats'));

          axiosInstance.get('/api/user-api-consumption/')
            .then((res) => setUserApiConsumption(res.data))
            .catch((error) => alert('Failed to fetch user API consumption'));
        }
      })
      .catch(() => {
        alert('Failed to fetch user data');
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    axiosInstance.post('/api/logout/')
      .then(() => navigate('/login'))
      .catch(() => alert('Logout failed'));
  };

  const handleQuizNavigation = () => {
    navigate('/prompt-generator');
  };

  const pageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  };

  const containerStyle = {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    textAlign: 'center',
    width: '600px',
    marginBottom: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    fontSize: '1em',
    color: '#fff',
    fontSize: '1.2em'
  };

  const thStyle = {
    backgroundColor: '#444',
    padding: '8px',
    border: '1px solid #666',
  };

  const tdStyle = {
    padding: '8px',
    border: '1px solid #666',
    textAlign: 'center',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '20px',
    marginRight: '10px', // Add margin between buttons
    transition: 'background-color 0.3s ease',
    fontSize: '15px',
  };

  const buttonHoverStyle = {
    backgroundColor: '#0056b3',
  };

  const headerBoxStyle = {
    maxWidth: '800px',
    marginBottom: '20px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'left',
    marginTop: '20px'
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
      <div>
        <div style={headerBoxStyle}>
          <img src={brightBrainLogo} alt="Bright Brain Logo" style={logoStyle} />
          <h1 style={titleStyle}>Bright Brain</h1>
        </div>
        <div style={containerStyle}>
          {isSuperuser ? (
            <>
              <h2>Welcome, Admin {username}!</h2>
              <p>This is the admin dashboard.</p>

              <h3>Endpoint Statistics:</h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Method</th>
                    <th style={thStyle}>Endpoint</th>
                    <th style={thStyle}>Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {endpointStats.map((stat, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>{stat.method}</td>
                      <td style={tdStyle}>{stat.endpoint}</td>
                      <td style={tdStyle}>{stat.total_requests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>User API Consumption:</h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>User ID</th>
                    <th style={thStyle}>Username</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Total Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {userApiConsumption.map((stat) => (
                    <tr key={stat.user__id}>
                      <td style={tdStyle}>{stat.user__id}</td>
                      <td style={tdStyle}>{stat.user__username}</td>
                      <td style={tdStyle}>{stat.user__email}</td>
                      <td style={tdStyle}>{stat.total_requests}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>All Users:</h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>User ID</th>
                    <th style={thStyle}>Username</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>API Calls</th>
                  </tr>
                </thead>
                <tbody>
                  {userList.map((user) => (
                    <tr key={user.id}>
                      <td style={tdStyle}>{user.id}</td>
                      <td style={tdStyle}>{user.username}</td>
                      <td style={tdStyle}>{user.email}</td>
                      <td style={tdStyle}>{user.api_calls}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <h2>Welcome, {username}!</h2>
              <p>You have made {apiCalls} API calls.</p>
              <p>Enjoy using our application!</p>
              <button
                onClick={handleQuizNavigation}
                style={buttonStyle}
                onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
              >
                Take a Quiz
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
            onMouseLeave={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
