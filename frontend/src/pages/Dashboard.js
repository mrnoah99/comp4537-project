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
      axios.get('https://Saerek.pythonanywhere.com/api/user/', {
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
          axios.get('https://Saerek.pythonanywhere.com/api/users/', {
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
    <div>
      {isSuperuser ? (
        // Admin Dashboard
        <div>
          <h2>Welcome, Admin {username}!</h2>
          <p>This is the admin dashboard.</p>
          <h3>All Users:</h3>
          <table border="1">
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
          <h2>Welcome, {username}!</h2>
          <p>You have made {apiCalls} API calls.</p>
          <p>Enjoy using our application!</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;