import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [apiCalls, setApiCalls] = useState(0);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [userList, setUserList] = useState([]);
  const [endpointStats, setEndpointStats] = useState([]);
  const [userApiConsumption, setUserApiConsumption] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile
    axiosInstance.get('/api/user/')
      .then((response) => {
        setUsername(response.data.username);
        setApiCalls(response.data.api_calls);
        setIsSuperuser(response.data.is_superuser);

        if (response.data.is_superuser) {
          // If admin, fetch the list of all users
          axiosInstance.get('/api/users/')
            .then((res) => {
              setUserList(res.data);
            })
            .catch((error) => {
              console.error('Error fetching user list:', error);
              alert('Failed to fetch user list');
            });

          // Fetch endpoint stats
          axiosInstance.get('/api/endpoint-stats/')
            .then((res) => {
              setEndpointStats(res.data);
            })
            .catch((error) => {
              console.error('Error fetching endpoint stats:', error);
              alert('Failed to fetch endpoint stats');
            });

          // Fetch user API consumption
          axiosInstance.get('/api/user-api-consumption/')
            .then((res) => {
              setUserApiConsumption(res.data);
            })
            .catch((error) => {
              console.error('Error fetching user API consumption:', error);
              alert('Failed to fetch user API consumption');
            });
        }
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
        alert('Failed to fetch user data');
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    axiosInstance.post('/api/logout/')
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  // Inline styles
  const containerStyle = {
    maxWidth: '800px',
    margin: '50px auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    fontSize: '1em',
  };

  const thStyle = {
    backgroundColor: '#f2f2f2',
    padding: '8px',
    border: '1px solid #ddd',
  };

  const tdStyle = {
    padding: '8px',
    border: '1px solid #ddd',
    textAlign: 'center',
  };

  const textCenterStyle = {
    textAlign: 'center',
    marginTop: '10px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '20px',
  };

  return (
    <div style={containerStyle}>
      {isSuperuser ? (
        // Admin Dashboard
        <div>
          <h2 style={{ textAlign: 'center', color: '#333' }}>Welcome, Admin {username}!</h2>
          <p style={textCenterStyle}>This is the admin dashboard.</p>

          {/* Endpoint Statistics */}
          <h3 style={textCenterStyle}>Endpoint Statistics:</h3>
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

          {/* User API Consumption */}
          <h3 style={textCenterStyle}>User API Consumption:</h3>
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

          {/* Existing User List */}
          <h3 style={textCenterStyle}>All Users:</h3>
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
        </div>
      ) : (
        // User Dashboard
        <div>
          <h2 style={{ textAlign: 'center', color: '#333' }}>Welcome, {username}!</h2>
          <p style={textCenterStyle}>You have made {apiCalls} API calls.</p>
          <p style={textCenterStyle}>Enjoy using our application!</p>
        </div>
      )}
      <button onClick={handleLogout} style={buttonStyle}>Logout</button>
    </div>
  );
}

export default Dashboard;
