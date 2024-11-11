import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [apiCalls, setApiCalls] = useState(0);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      // Fetch user profile
      axios.get('http://localhost:8000/api/user/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
      .then((response) => {
        setUsername(response.data.username);
        setApiCalls(response.data.api_calls);
        setIsSuperuser(response.data.is_superuser);

        if (response.data.is_superuser) {
          // If admin, fetch the list of all users
          axios.get('http://localhost:8000/api/users/', {
            headers: {
              Authorization: `Token ${token}`,
            },
          })
          .then((res) => {
            setUserList(res.data);
          })
          .catch((error) => {
            console.error('Error fetching user list:', error);
            alert('Failed to fetch user list');
          });
        }
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
        alert('Failed to fetch user data');
        navigate('/login');
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div style={containerStyle}>
      {isSuperuser ? (
        // Admin Dashboard
        <div>
          <h2 style={{ textAlign: 'center', color: '#333' }}>Welcome, Admin {username}!</h2>
          <p style={textCenterStyle}>This is the admin dashboard.</p>
          <h3 style={textCenterStyle}>All Users:</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>API Calls</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.api_calls}</td>
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

// Inline styles
const containerStyle = {
  maxWidth: '600px',
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

export default Dashboard;
