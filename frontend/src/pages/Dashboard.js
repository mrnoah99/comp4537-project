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
  const [editingUser, setEditingUser] = useState(null);
  const [userEditFormData, setUserEditFormData] = useState({});
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailFormData, setEmailFormData] = useState({ email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile
    axiosInstance.get('/api/user/')
      .then((response) => {
        setUsername(response.data.username);
        setApiCalls(response.data.api_calls);
        setIsSuperuser(response.data.is_superuser);
        setEmailFormData({ email: response.data.email });

        if (response.data.is_superuser) {
          // If admin, fetch additional data
          fetchAdminData();
        }
      })
      .catch((error) => {
        console.error('Error fetching user profile:', error);
        alert('Failed to fetch user data');
        navigate('/login');
      });
  }, [navigate]);

  const fetchAdminData = () => {
    // Fetch the list of all users
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
  };

  const handleLogout = () => {
    axiosInstance.post('/api/logout/')
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  // Handle Edit User Click
  const handleUserEditClick = (user) => {
    setEditingUser(user);
    setUserEditFormData({
      username: user.username,
      email: user.email,
      api_calls: user.api_calls,
      password: '',
    });
  };

  // Handle User Input Change
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle User Form Submit (uses PUT method)
  const handleUserFormSubmit = (e) => {
    e.preventDefault();
    const updatedUserData = {
      username: userEditFormData.username,
      email: userEditFormData.email,
      api_calls: userEditFormData.api_calls,
    };

    // If password is provided, include it
    if (userEditFormData.password) {
      updatedUserData.password = userEditFormData.password;
    }

    axiosInstance.put(`/api/users/${editingUser.id}/update/`, updatedUserData)
      .then((res) => {
        alert('User updated successfully');
        // Refresh data
        fetchAdminData();
        // Close the edit form
        setEditingUser(null);
      })
      .catch((error) => {
        console.error('Error updating user:', error);
        // Display specific error messages if available
        if (error.response && error.response.data) {
          alert(`Failed to update user: ${JSON.stringify(error.response.data)}`);
        } else {
          alert('Failed to update user');
        }
      });
  };

  // Handle Delete User
  const handleUserDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      axiosInstance.delete(`/api/users/${id}/delete/`)
        .then(() => {
          alert('User deleted successfully');
          fetchAdminData();
        })
        .catch((error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        });
    }
  };

  // Handle Edit Email Click
  const handleEditEmailClick = () => {
    setEditingEmail(true);
  };

  // Handle Email Input Change
  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Email Form Submit (uses PATCH method)
  const handleEmailFormSubmit = (e) => {
    e.preventDefault();
    axiosInstance.patch('/api/user/update-email/', emailFormData)
      .then((res) => {
        alert('Email updated successfully');
        setEditingEmail(false);
        // Update the displayed email
        setEmailFormData({ email: res.data.email });
      })
      .catch((error) => {
        console.error('Error updating email:', error);
        // Display specific error messages if available
        if (error.response && error.response.data) {
          alert(`Failed to update email: ${JSON.stringify(error.response.data)}`);
        } else {
          alert('Failed to update email');
        }
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

  const smallButtonStyle = {
    padding: '5px 10px',
    fontSize: '0.8em',
    marginRight: '5px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const deleteButtonStyle = {
    ...smallButtonStyle,
    backgroundColor: 'red',
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
                <tr key={stat.user_id}>
                  <td style={tdStyle}>{stat.user_id}</td>
                  <td style={tdStyle}>{stat.username}</td>
                  <td style={tdStyle}>{stat.email}</td>
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
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id}>
                  <td style={tdStyle}>{user.id}</td>
                  <td style={tdStyle}>{user.username}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>{user.api_calls}</td>
                  <td style={tdStyle}>
                    {user.is_superuser ? (
                      <span>Admin</span>
                    ) : (
                      <>
                        <button onClick={() => handleUserEditClick(user)} style={smallButtonStyle}>Edit</button>
                        <button onClick={() => handleUserDelete(user.id)} style={deleteButtonStyle}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Edit User Form */}
          {editingUser && (
            <div style={{ marginTop: '20px' }}>
              <h3>Edit User (ID: {editingUser.id})</h3>
              <form onSubmit={handleUserFormSubmit}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ marginRight: '10px' }}>Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={userEditFormData.username}
                    onChange={handleUserInputChange}
                    required
                    style={{ padding: '5px', width: '60%' }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ marginRight: '10px' }}>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={userEditFormData.email}
                    onChange={handleUserInputChange}
                    required
                    style={{ padding: '5px', width: '60%' }}
                  />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ marginRight: '10px' }}>API Calls:</label>
                  <input
                    type="number"
                    name="api_calls"
                    value={userEditFormData.api_calls}
                    onChange={handleUserInputChange}
                    required
                    style={{ padding: '5px', width: '60%' }}
                  />
                </div>
                {/* Optional Password Reset */}
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ marginRight: '10px' }}>New Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={userEditFormData.password || ''}
                    onChange={handleUserInputChange}
                    placeholder="Leave blank to keep current password"
                    style={{ padding: '5px', width: '60%' }}
                  />
                </div>
                <button type="submit" style={{ ...buttonStyle, marginRight: '10px' }}>Save</button>
                <button type="button" onClick={() => setEditingUser(null)} style={buttonStyle}>Cancel</button>
              </form>
            </div>
          )}

        </div>
      ) : (
        // User Dashboard
        <div>
          <h2 style={{ textAlign: 'center', color: '#333' }}>Welcome, {username}!</h2>
          <p style={textCenterStyle}>You have made {apiCalls} API calls.</p>
          <p style={textCenterStyle}>Enjoy using our application!</p>

          {/* Edit Email */}
          {!editingEmail ? (
            <div>
              <p style={textCenterStyle}>Email: {emailFormData.email}</p>
              <button onClick={handleEditEmailClick} style={buttonStyle}>Edit Email</button>
            </div>
          ) : (
            <div style={{ marginTop: '20px' }}>
              <h3>Edit Email</h3>
              <form onSubmit={handleEmailFormSubmit}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ marginRight: '10px' }}>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={emailFormData.email}
                    onChange={handleEmailInputChange}
                    required
                    style={{ padding: '5px', width: '60%' }}
                  />
                </div>
                <button type="submit" style={{ ...buttonStyle, marginRight: '10px' }}>Save</button>
                <button type="button" onClick={() => setEditingEmail(false)} style={buttonStyle}>Cancel</button>
              </form>
            </div>
          )}

          {/* Button to Make LLM API Call */}
          <button onClick={() => makeLlmApiCall()} style={buttonStyle}>Make LLM API Call</button>
        </div>
      )}
      <button onClick={handleLogout} style={buttonStyle}>Logout</button>
    </div>
  );

  // Function to make LLM API Call
  const makeLlmApiCall = () => {
    axiosInstance.post('/api/llm-call/')
      .then((response) => {
        alert(`LLM Response: ${response.data.data}`);
        // Update API calls count
        setApiCalls(prevCalls => prevCalls + 1);
      })
      .catch((error) => {
        console.error('Error making LLM API call:', error);
        alert('Failed to make LLM API call');
      });
  };
}

export default Dashboard;
