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
  const [editingUser, setEditingUser] = useState(null);
  const [userEditFormData, setUserEditFormData] = useState({});
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailFormData, setEmailFormData] = useState({ email: '' });
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
    axiosInstance.get('/api/users/')
      .then((res) => setUserList(res.data))
      .catch((error) => alert('Failed to fetch user list'));

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
        console.log('User API Consumption:', res.data);
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
  //     .then(() => navigate('/login'))
  //     .catch(() => alert('Logout failed'));
  // };

  const handleQuizNavigation = () => {
    navigate('/quiz');
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
                  {userApiConsumption.map((stat, index) => (
                    <tr key={index}>
                      <td style={tdStyle}>{stat.user_id}</td>
                      <td style={tdStyle}>{stat.username}</td>
                      <td style={tdStyle}>{stat.email}</td>
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
